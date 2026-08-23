from functools import lru_cache
from langchain_openai import OpenAIEmbeddings
from langchain_huggingface import HuggingFaceEmbeddings
from src.config.settings import settings

@lru_cache(maxsize=1)
def get_embedding_model():
    if settings.LLM_PROVIDER.lower() == "openai":
        return OpenAIEmbeddings(
            model=settings.EMBEDDING_MODEL_NAME, 
            openai_api_key=settings.OPENAI_API_KEY
        )
    else:
        return HuggingFaceEmbeddings(
            model_name=settings.LOCAL_EMBEDDING_MODEL
        )
