import pickle
import os
from typing import List
from rank_bm25 import BM25Okapi
from langchain_core.documents import Document
from src.config.settings import settings

class BM25SearchService:
    def __init__(self):
        self.index_path = settings.BM25_INDEX_PATH
        self.documents: List[Document] = []
        self.bm25: BM25Okapi = None
        self._load_index()

    def _load_index(self):
        if os.path.exists(self.index_path):
            with open(self.index_path, 'rb') as f:
                data = pickle.load(f)
                self.documents = data['documents']
                self.bm25 = data['bm25']

    def _save_index(self):
        os.makedirs(os.path.dirname(self.index_path), exist_ok=True)
        with open(self.index_path, 'wb') as f:
            pickle.dump({'documents': self.documents, 'bm25': self.bm25}, f)

    def add_documents(self, documents: List[Document]):
        self.documents.extend(documents)
        tokenized_corpus = [doc.page_content.lower().split(" ") for doc in self.documents]
        self.bm25 = BM25Okapi(tokenized_corpus)
        self._save_index()

    def search(self, query: str, top_k: int = None) -> List[Document]:
        if not self.bm25 or not self.documents:
            return []
            
        k = top_k or settings.TOP_K_BM25
        tokenized_query = query.lower().split(" ")
        
        # Get top-n directly
        results = self.bm25.get_top_n(tokenized_query, self.documents, n=k)
        return results
