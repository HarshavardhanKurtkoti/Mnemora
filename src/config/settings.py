from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "Production RAG System"
    API_V1_STR: str = "/api/v1"
    
    # LLM Provider Configuration
    # Supports 'openai', 'groq', or 'local'
    LLM_PROVIDER: str = "openai"
    OPENAI_API_KEY: Optional[str] = None
    GROQ_API_KEY: Optional[str] = None
    
    # Model Configuration
    LLM_MODEL_NAME: str = "gpt-4o-mini"
    EMBEDDING_MODEL_NAME: str = "text-embedding-3-small"
    LOCAL_EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    CROSS_ENCODER_MODEL: str = "cross-encoder/ms-marco-MiniLM-L-6-v2"
    
    # Retrieval Configuration
    VECTOR_DB_PATH: str = "./data/chroma_db"
    BM25_INDEX_PATH: str = "./data/bm25_index.pkl"
    CHUNK_SIZE: int = 800
    CHUNK_OVERLAP: int = 100
    
    # Hybrid Search Settings
    TOP_K_VECTOR: int = 10
    TOP_K_BM25: int = 10
    FINAL_TOP_K_AFTER_RERANK: int = 5
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore", case_sensitive=True)

settings = Settings()
