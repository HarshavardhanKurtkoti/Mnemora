import os
import tempfile
import time
import logging
from fastapi import APIRouter, UploadFile, File, Depends
from typing import List, Optional
from pydantic import BaseModel, Field
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
        raise ValueError("Empty query provided.")
        
    # 1. Hybrid Retrieval (Vector + BM25)
    retrieved_docs = hybrid_search.search(request.query)
    vector_count = settings.TOP_K_VECTOR
    bm25_count = settings.TOP_K_BM25
    
    # 2. Re-rank
    reranked_docs = reranker.rerank(request.query, retrieved_docs)
    reranked_count = len(reranked_docs)
    
    # 3. Generate Answer
    response = generation.generate_answer(request.query, reranked_docs)
    
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
    
    latency_ms = (time.time() - start_time) * 1000
    
    # Save query to database
    db_query = models.QueryHistory(
        query_text=request.query,
        strategy_type="HYBRID RRF",
        latency_ms=latency_ms
    )
    db.add(db_query)
    db.commit()
    
    return success_response({
        "answer": response.get("answer", ""),
        "citations": citations,
        "retrieval": stats
    })
