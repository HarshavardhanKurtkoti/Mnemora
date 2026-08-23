from typing import List
from langchain_core.documents import Document
from fastembed.rerank.cross_encoder import TextCrossEncoder
from src.config.settings import settings
import warnings

# Filter warnings for cleaner output
warnings.filterwarnings("ignore", category=UserWarning)

class ReRankerService:
    _model_instance = None
    
    def __init__(self):
        # Load the cross-encoder locally only once.
        if ReRankerService._model_instance is None:
            ReRankerService._model_instance = TextCrossEncoder(model_name="Xenova/ms-marco-MiniLM-L-6-v2")
        self.model = ReRankerService._model_instance

    def rerank(self, query: str, documents: List[Document], top_k: int = None) -> List[Document]:
        if not documents:
            return []
            
        k = top_k or settings.FINAL_TOP_K_AFTER_RERANK
        
        # Extract documents text
        docs_text = [doc.page_content for doc in documents]
        
        # Compute scores using fastembed rerank (returns a generator yielding lists of scores)
        # We only have one query, so we get the first list of scores
        results = list(self.model.rerank(query, docs_text))
        
        # Combine docs and scores
        scored_docs = list(zip(documents, results))
        
        # Sort by score descending
        scored_docs.sort(key=lambda x: x[1], reverse=True)
        
        # Add the cross_encoder score to metadata for debugging/auditing
        for doc, score in scored_docs:
            doc.metadata["relevance_score"] = float(score)
            
        # Return top K
        return [doc for doc, score in scored_docs[:k]]
