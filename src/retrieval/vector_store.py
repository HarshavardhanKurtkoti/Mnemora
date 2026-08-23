from typing import List
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma
import chromadb
from src.retrieval.embeddings import get_embedding_model
from src.config.settings import settings

class VectorStoreService:
    def __init__(self):
        self.embeddings = get_embedding_model()
        # Connect to the Chroma docker container instead of using local SQLite
        # This prevents KeyError on hot-reload.
        chroma_client = chromadb.HttpClient(host="chroma", port=8000)
        
        self.db = Chroma(
            client=chroma_client,
            embedding_function=self.embeddings,
            collection_name="rag_documents"
        )
        
    def add_documents(self, documents: List[Document]):
        self.db.add_documents(documents)
        
    def search(self, query: str, top_k: int = None) -> List[Document]:
        k = top_k or settings.TOP_K_VECTOR
        return self.db.similarity_search(query, k=k)
