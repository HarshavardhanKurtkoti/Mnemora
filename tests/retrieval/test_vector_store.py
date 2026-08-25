from langchain_core.documents import Document
from src.retrieval.vector_store import VectorStoreService

def test_vector_store_service_lifecycle():
    # Initialize the service (should fallback to :memory:)
    service = VectorStoreService()
    
    # Create test documents
    docs = [
        Document(page_content="FastAPI is a modern, fast (high-performance), web framework for building APIs.", metadata={"chunk_id": "doc1"}),
        Document(page_content="Qdrant is a vector similarity search engine.", metadata={"chunk_id": "doc2"})
    ]
    
    # Add documents
    service.add_documents(docs)
    
    # Search documents
    results = service.search("What is Qdrant?", top_k=1)
    
    assert len(results) == 1
    assert "similarity search engine" in results[0].page_content
