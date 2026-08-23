from typing import List
from langchain_core.documents import Document
from sentence_transformers import CrossEncoder
from src.config.settings import settings
import warnings

# Filter HuggingFace warnings for cleaner output
warnings.filterwarnings("ignore", category=UserWarning)

class ReRankerService:
    _model_instance = None
    
    def __init__(self):
        # Load the cross-encoder locally only once.
        if ReRankerService._model_instance is None:
            ReRankerService._model_instance = CrossEncoder(settings.CROSS_ENCODER_MODEL)
        self.model = ReRankerService._model_instance

    def rerank(self, query: str, documents: List[Document], top_k: int = None) -> List[Document]:
        if not documents:
            return []
            
        k = top_k or settings.FINAL_TOP_K_AFTER_RERANK
        
        # Prepare pairs of (query, document_text)
        pairs = [[query, doc.page_content] for doc in documents]
        
        # Compute scores
        scores = self.model.predict(pairs)
        
        # Combine docs and scores
        scored_docs = list(zip(documents, scores))
        
        # Sort by score descending
        scored_docs.sort(key=lambda x: x[1], reverse=True)
        
        # Add the cross_encoder score to metadata for debugging/auditing
        for doc, score in scored_docs:
            doc.metadata["relevance_score"] = float(score)
            
        # Return top K
        return [doc for doc, score in scored_docs[:k]]
