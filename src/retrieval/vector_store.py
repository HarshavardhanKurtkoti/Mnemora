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
        client = None
        if settings.QDRANT_URL and settings.QDRANT_API_KEY:
            try:
                remote_client = QdrantClient(
                    url=settings.QDRANT_URL,
                    api_key=settings.QDRANT_API_KEY,
                    timeout=4.0
                )
                # Verify connectivity
                remote_client.get_collections()
                client = remote_client
            except Exception:
                client = QdrantClient(":memory:")
        else:
            client = QdrantClient(":memory:")
            
        # Ensure collection exists
        collection_name = "rag_documents"
        if not client.collection_exists(collection_name=collection_name):
            dummy_vector = self.embeddings.embed_query("dummy")
            vector_size = len(dummy_vector)
            from qdrant_client.http import models as qdrant_models
            client.create_collection(
                collection_name=collection_name,
                vectors_config=qdrant_models.VectorParams(
                    size=vector_size,
                    distance=qdrant_models.Distance.COSINE
                )
            )
            
        self.db = QdrantVectorStore(
            client=client,
            collection_name=collection_name,
            embedding=self.embeddings,
        )
        
    def add_documents(self, documents: List[Document]):
        self.db.add_documents(documents)
        
    def search(self, query: str, top_k: int = None) -> List[Document]:
        k = top_k or settings.TOP_K_VECTOR
        return self.db.similarity_search(query, k=k)
