from unittest.mock import patch
from langchain_core.documents import Document
from src.retrieval.hybrid_search import HybridSearchService

@patch("src.retrieval.hybrid_search.VectorStoreService")
@patch("src.retrieval.hybrid_search.BM25SearchService")
def test_rrf_fusion(mock_bm25, mock_vector):
    service = HybridSearchService()
    
    # Mock some vector results
    v_results = [
        Document(page_content="A", metadata={"chunk_id": "c1"}),
        Document(page_content="B", metadata={"chunk_id": "c2"})
    ]
    
    # Mock some bm25 results
    b_results = [
        Document(page_content="B", metadata={"chunk_id": "c2"}),
        Document(page_content="C", metadata={"chunk_id": "c3"})
    ]
    
    # c2 is in both, should rank highest
    fused = service.rrf_fusion(v_results, b_results, k=60)
    
    assert len(fused) == 3
    assert fused[0].metadata["chunk_id"] == "c2"
