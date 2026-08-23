from typing import List
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma
from src.retrieval.embeddings import get_embedding_model
from src.config.settings import settings

class VectorStoreService:
    def __init__(self):
        self.embeddings = get_embedding_model()
        self.db = Chroma(
            persist_directory=settings.VECTOR_DB_PATH,
            embedding_function=self.embeddings,
            collection_name="rag_documents"
        )
        
    def add_documents(self, documents: List[Document]):
        self.db.add_documents(documents)
        
    def search(self, query: str, top_k: int = None) -> List[Document]:
        k = top_k or settings.TOP_K_VECTOR
        return self.db.similarity_search(query, k=k)
