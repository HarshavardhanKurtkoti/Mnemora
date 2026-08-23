from typing import List
from langchain_core.documents import Document
from src.retrieval.vector_store import VectorStoreService
from src.retrieval.bm25_search import BM25SearchService
from src.config.settings import settings

class HybridSearchService:
    def __init__(self):
        self.vector_store = VectorStoreService()
        self.bm25_store = BM25SearchService()

    def rrf_fusion(self, vector_results: List[Document], bm25_results: List[Document], k=60) -> List[Document]:
        """Reciprocal Rank Fusion algorithm"""
        fused_scores = {}
        document_map = {}
        
        # Assign RRF scores for Vector results
        for rank, doc in enumerate(vector_results):
            doc_id = doc.metadata.get("chunk_id")
            if not doc_id:
                # Fallback if chunk_id is missing, though it shouldn't be
                doc_id = hash(doc.page_content)
                
            if doc_id not in fused_scores:
                fused_scores[doc_id] = 0
            fused_scores[doc_id] += 1 / (rank + k)
            document_map[doc_id] = doc
            
        # Assign RRF scores for BM25 results
        for rank, doc in enumerate(bm25_results):
            doc_id = doc.metadata.get("chunk_id")
            if not doc_id:
                doc_id = hash(doc.page_content)
                
            if doc_id not in fused_scores:
                fused_scores[doc_id] = 0
            fused_scores[doc_id] += 1 / (rank + k)
            document_map[doc_id] = doc

        # Sort documents by their RRF score in descending order
        reranked_docs = [
            document_map[doc_id]
            for doc_id, score in sorted(fused_scores.items(), key=lambda x: x[1], reverse=True)
        ]
        
        return reranked_docs

    def search(self, query: str) -> List[Document]:
        vector_results = self.vector_store.search(query, top_k=settings.TOP_K_VECTOR)
        bm25_results = self.bm25_store.search(query, top_k=settings.TOP_K_BM25)
        
        hybrid_results = self.rrf_fusion(vector_results, bm25_results)
        
        return hybrid_results
