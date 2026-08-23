from langchain_core.documents import Document
from src.ingestion.chunking import ChunkingService
from src.config.settings import settings

def test_token_aware_chunking():
    # Use standard text that will have a predictable token count
    # 'word ' is 1 token in cl100k_base usually. Let's do something very long.
    text = "word " * 1000
    docs = [
        Document(
            page_content=text,
            metadata={"source": "test.txt", "document_id": "123"}
        )
    ]
    
    settings.CHUNK_SIZE = 100
    settings.CHUNK_OVERLAP = 10
    
    chunked = ChunkingService.chunk_documents(docs)
    
    # Should be split into many chunks
    assert len(chunked) > 5
    
    # Check that chunks respect token limit roughly
    for chunk in chunked:
        token_len = ChunkingService.tiktoken_len(chunk.page_content)
        assert token_len <= 110 # Allowing a little leeway for overlap/separators
        assert "chunk_id" in chunk.metadata
        assert chunk.metadata["page"] is None # Added by our explicit null check
