from typing import List
from langchain_core.documents import Document
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from src.retrieval.embeddings import get_embedding_model
from src.config.settings import settings

class VectorStoreService:
    def __init__(self):
        self.embeddings = get_embedding_model()
        
        # Connect to Qdrant Cloud if URL is provided, otherwise fallback to memory
        if settings.QDRANT_URL and settings.QDRANT_API_KEY:
            client = QdrantClient(
                url=settings.QDRANT_URL,
                api_key=settings.QDRANT_API_KEY
            )
        else:
            client = QdrantClient(":memory:")
            
        self.db = QdrantVectorStore(
            client=client,
            collection_name="rag_documents",
            embedding=self.embeddings,
        )
        
    def add_documents(self, documents: List[Document]):
        self.db.add_documents(documents)
        
    def search(self, query: str, top_k: int = None) -> List[Document]:
        k = top_k or settings.TOP_K_VECTOR
        return self.db.similarity_search(query, k=k)
