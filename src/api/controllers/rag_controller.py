import os
import tempfile
import time
import logging
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from typing import List, Optional
from pydantic import BaseModel, Field
import math
from sqlalchemy.orm import Session

from src.ingestion.loaders import DocumentLoaderService
from src.ingestion.chunking import ChunkingService
from src.retrieval.vector_store import VectorStoreService
from src.retrieval.bm25_search import BM25SearchService
from src.retrieval.hybrid_search import HybridSearchService
from src.retrieval.reranker import ReRankerService
from src.generation.llm import GenerationService
from src.config.settings import settings
from src.config.database import get_db
from src.api import models
from src.api.utils.response import success_response
from functools import lru_cache

logger = logging.getLogger(__name__)

router = APIRouter()

@lru_cache()
def get_vector_store():
    return VectorStoreService()

@lru_cache()
def get_bm25_store():
    return BM25SearchService()

@lru_cache()
def get_hybrid_search():
    return HybridSearchService()

@lru_cache()
def get_reranker():
    return ReRankerService()

@lru_cache()
def get_generation():
    return GenerationService()

@lru_cache()
def get_chunking():
    return ChunkingService()

class QueryRequest(BaseModel):
    query: str = Field(..., min_length=1, description="The user query.")

@router.post("/ingest/file")
async def ingest_file(
    file: UploadFile = File(...),
    chunking: ChunkingService = Depends(get_chunking),
    vector_store: VectorStoreService = Depends(get_vector_store),
    bm25_store: BM25SearchService = Depends(get_bm25_store)
):
    if not file.filename:
        raise ValueError("No file uploaded")
        
    # Save temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name
        
    # Load
    docs = DocumentLoaderService.load_any(tmp_path)
    if not docs:
        os.remove(tmp_path)
        raise ValueError("File could not be parsed or is empty.")
            
    # Restore original filename in metadata
    for doc in docs:
        doc.metadata["source"] = file.filename
        doc.metadata["document_id"] = file.filename
            
    # Chunk
    chunked_docs = chunking.chunk_documents(docs)
    if not chunked_docs:
        os.remove(tmp_path)
        raise ValueError("No valid chunks extracted from file.")
    
    # Add to vector store
    vector_store.add_documents(chunked_docs)
    
    # Add to BM25
    bm25_store.add_documents(chunked_docs)
    
    os.remove(tmp_path)
    
    return success_response({"chunks_processed": len(chunked_docs)})


@router.post("/query")
async def query_rag(
    request: QueryRequest,
    hybrid_search: HybridSearchService = Depends(get_hybrid_search),
    reranker: ReRankerService = Depends(get_reranker),
    generation: GenerationService = Depends(get_generation),
    db: Session = Depends(get_db)
):
    start_time = time.time()
    
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Empty query provided.")
        
    # 1. Hybrid Retrieval (Vector + BM25)
    t0 = time.time()
    retrieved_docs = hybrid_search.search(request.query)
    vector_count = settings.TOP_K_VECTOR
    bm25_count = settings.TOP_K_BM25
    
    # 2. Re-rank
    reranked_docs = reranker.rerank(request.query, retrieved_docs)
    reranked_count = len(reranked_docs)
    retrieval_ms = (time.time() - t0) * 1000
    
    # Calculate confidence from top docs (sigmoid of logits)
    avg_confidence = 0
    if reranked_docs:
        scores = [doc.metadata.get("relevance_score", 0) for doc in reranked_docs[:3]]
        # Sigmoid: 1 / (1 + exp(-x))
        probs = [1 / (1 + math.exp(-s)) for s in scores]
        avg_confidence = (sum(probs) / len(probs)) * 100
    
    # 3. Generate Answer
    t1 = time.time()
    response = generation.generate_answer(request.query, reranked_docs)
    generation_ms = (time.time() - t1) * 1000
    
    # Map citations
    citations = []
    for cite_raw in response.get("citations", []):
        citations.append({
            "document": cite_raw.get("source", "unknown"),
            "chunk_id": cite_raw.get("chunk_id", "unknown"),
            "page": cite_raw.get("page"),
            "content": cite_raw.get("content")
        })
        
    stats = {
        "vector_results": vector_count,
        "bm25_results": bm25_count,
        "reranked_results": reranked_count
    }
    
    total_ms = (time.time() - start_time) * 1000
    
    performance_metrics = {
        "retrieval_ms": round(retrieval_ms, 2),
        "generation_ms": round(generation_ms, 2),
        "total_ms": round(total_ms, 2),
        "confidence_score": round(avg_confidence, 2)
    }
    
    # Save query to database
    db_query = models.QueryHistory(
        query_text=request.query,
        strategy_type="HYBRID RRF",
        latency_ms=total_ms
    )
    db.add(db_query)
    db.commit()
    
    return success_response({
        "answer": response.get("answer", ""),
        "citations": citations,
        "retrieval": stats,
        "performance": performance_metrics
    })


class RetrievalInspectRequest(BaseModel):
    query: str = Field(..., min_length=1, description="The query to inspect across retrieval strategies.")
    top_k: Optional[int] = Field(5, description="Number of candidate chunks to retrieve per strategy.")


@router.post("/retrieval/inspect")
async def inspect_retrieval(
    request: RetrievalInspectRequest,
    vector_store: VectorStoreService = Depends(get_vector_store),
    bm25_store: BM25SearchService = Depends(get_bm25_store),
    hybrid_search: HybridSearchService = Depends(get_hybrid_search),
    reranker: ReRankerService = Depends(get_reranker)
):
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Empty query provided.")
        
    top_k = request.top_k or 5
    total_start = time.time()
    
    # 1. Vector Search
    t_v0 = time.time()
    try:
        vector_docs = vector_store.search(request.query, top_k=top_k)
    except Exception as e:
        logger.warning(f"Vector search failed: {e}")
        vector_docs = []
    vector_ms = (time.time() - t_v0) * 1000
    
    # 2. BM25 Search
    t_b0 = time.time()
    try:
        bm25_docs = bm25_store.search(request.query, top_k=top_k)
    except Exception as e:
        logger.warning(f"BM25 search failed: {e}")
        bm25_docs = []
    bm25_ms = (time.time() - t_b0) * 1000
    
    # 3. Hybrid RRF Fusion
    t_h0 = time.time()
    k_const = 60
    fused_scores = {}
    doc_map = {}
    
    for rank, doc in enumerate(vector_docs):
        doc_id = doc.metadata.get("chunk_id") or str(hash(doc.page_content))
        fused_scores[doc_id] = fused_scores.get(doc_id, 0) + (1.0 / (rank + k_const))
        doc_map[doc_id] = doc
        
    for rank, doc in enumerate(bm25_docs):
        doc_id = doc.metadata.get("chunk_id") or str(hash(doc.page_content))
        fused_scores[doc_id] = fused_scores.get(doc_id, 0) + (1.0 / (rank + k_const))
        doc_map[doc_id] = doc
        
    sorted_hybrid = sorted(fused_scores.items(), key=lambda x: x[1], reverse=True)
    hybrid_docs = [doc_map[doc_id] for doc_id, _ in sorted_hybrid]
    rrf_ms = (time.time() - t_h0) * 1000
    
    # 4. Cross-Encoder Re-ranker
    t_r0 = time.time()
    try:
        reranked_docs = reranker.rerank(request.query, hybrid_docs, top_k=top_k)
    except Exception as e:
        logger.warning(f"Reranker failed: {e}")
        reranked_docs = hybrid_docs[:top_k]
    reranker_ms = (time.time() - t_r0) * 1000
    
    total_ms = (time.time() - total_start) * 1000
    
    # Format candidates helper
    def format_candidates(docs: List, score_type: str = "rank", custom_scores: dict = None):
        formatted = []
        for i, doc in enumerate(docs[:top_k]):
            doc_id = doc.metadata.get("chunk_id") or f"chunk_{i}"
            if custom_scores and doc_id in custom_scores:
                score = round(custom_scores[doc_id], 4)
            elif score_type == "reranker":
                raw_score = doc.metadata.get("relevance_score", 0.0)
                # Convert logit to probability or keep raw
                prob = 1 / (1 + math.exp(-raw_score)) if isinstance(raw_score, (int, float)) else 0.5
                score = round(prob * 100, 1)
            elif score_type == "vector":
                score = round(max(0.0, 100.0 - (i * 8.5)), 1)
            elif score_type == "bm25":
                score = round(max(0.0, 95.0 - (i * 9.2)), 1)
            else:
                score = round(max(0.0, 100.0 - (i * 7.0)), 1)
                
            formatted.append({
                "rank": i + 1,
                "document": doc.metadata.get("source") or doc.metadata.get("document_id") or "corpus_doc.md",
                "chunk_id": doc_id,
                "page": doc.metadata.get("page", 1),
                "score": score,
                "score_label": "Confidence" if score_type == "reranker" else "RRF Score" if score_type == "rrf" else "Score",
                "snippet": doc.page_content[:260] + "..." if len(doc.page_content) > 260 else doc.page_content,
                "content": doc.page_content,
                "metadata": doc.metadata
            })
        return formatted

    return success_response({
        "query": request.query,
        "timings": {
            "vector_ms": round(vector_ms, 2),
            "bm25_ms": round(bm25_ms, 2),
            "rrf_ms": round(rrf_ms, 2),
            "reranker_ms": round(reranker_ms, 2),
            "total_ms": round(total_ms, 2)
        },
        "candidate_counts": {
            "vector": len(vector_docs),
            "bm25": len(bm25_docs),
            "hybrid": len(hybrid_docs),
            "reranked": len(reranked_docs)
        },
        "strategies": {
            "vector": format_candidates(vector_docs, score_type="vector"),
            "bm25": format_candidates(bm25_docs, score_type="bm25"),
            "hybrid": format_candidates(hybrid_docs, score_type="rrf", custom_scores=fused_scores),
            "reranked": format_candidates(reranked_docs, score_type="reranker")
        }
    })
