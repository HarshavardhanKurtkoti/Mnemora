from functools import lru_cache
from langchain_openai import OpenAIEmbeddings
from langchain_huggingface import HuggingFaceEmbeddings
from src.config.settings import settings

@lru_cache(maxsize=1)
def get_embedding_model():
    if settings.LLM_PROVIDER.lower() == "openai" and settings.OPENAI_API_KEY:
        return OpenAIEmbeddings(
            model=settings.EMBEDDING_MODEL_NAME, 
            openai_api_key=settings.OPENAI_API_KEY
        )
    else:
        import logging
        logging.getLogger(__name__).info("Using local embeddings because OPENAI_API_KEY is missing or LLM_PROVIDER is local.")
        return HuggingFaceEmbeddings(
            model_name=settings.LOCAL_EMBEDDING_MODEL
        )
