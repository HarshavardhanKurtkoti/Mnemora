import pytest
from pydantic import BaseModel
from typing import List
from langchain_core.documents import Document
from src.generation.llm import GenerationService
from src.config.settings import settings

class LLMResponse(BaseModel):
    answer: str
    citations: List[str]

class MockLLM:
    def __init__(self, responses):
        self.responses = responses
        self.call_count = 0
        
    def invoke(self, prompt):
        if self.call_count < len(self.responses):
            resp = self.responses[self.call_count]
            self.call_count += 1
            return resp
        return self.responses[-1]

def get_dummy_service(mock_llm=None):
    original_provider = settings.LLM_PROVIDER
    settings.LLM_PROVIDER = "dummy"
    service = GenerationService.__new__(GenerationService)
    if mock_llm:
        service.llm = mock_llm
        service.prompt_template = "{context}\n{question}"
    settings.LLM_PROVIDER = original_provider
    return service

def test_empty_retrieved_docs():
    service = get_dummy_service()
    response = service.generate_answer("What is X?", [])
    assert "insufficient information" in response["answer"].lower()
    assert len(response["citations"]) == 0

def test_format_context():
    service = get_dummy_service()
    docs = [Document(page_content="Test content", metadata={"chunk_id": "c1", "source": "test.md"})]
    context = service.format_context(docs)
    
    assert "CHUNK_ID: c1" in context
    assert "SOURCE: test.md" in context
    assert "Test content" in context

def test_valid_citation():
    mock = MockLLM([LLMResponse(answer="It is X.", citations=["c1"])])
    service = get_dummy_service(mock)
    docs = [Document(page_content="X is good", metadata={"chunk_id": "c1", "source": "test.md"})]
    
    res = service.generate_answer("What is X?", docs)
    assert res["answer"] == "It is X."
    assert len(res["citations"]) == 1
    assert res["citations"][0]["chunk_id"] == "c1"

def test_fabricated_citation_retry_failure():
    # LLM always hallucinates "c999"
    mock = MockLLM([
        LLMResponse(answer="It is X.", citations=["c999"]),
        LLMResponse(answer="It is X.", citations=["c999"])
    ])
    service = get_dummy_service(mock)
    docs = [Document(page_content="X is good", metadata={"chunk_id": "c1", "source": "test.md"})]
    
    res = service.generate_answer("What is X?", docs)
    # Backend should reject and fallback to insufficient evidence
    assert "insufficient information" in res["answer"].lower()
    assert len(res["citations"]) == 0
    assert mock.call_count == 2 # verified retry happened

def test_fabricated_citation_retry_success():
    # LLM hallucinates first, then gets it right on retry
    mock = MockLLM([
        LLMResponse(answer="It is X.", citations=["c999"]),
        LLMResponse(answer="It is X.", citations=["c1"])
    ])
    service = get_dummy_service(mock)
    docs = [Document(page_content="X is good", metadata={"chunk_id": "c1", "source": "test.md"})]
    
    res = service.generate_answer("What is X?", docs)
    assert res["answer"] == "It is X."
    assert len(res["citations"]) == 1
    assert res["citations"][0]["chunk_id"] == "c1"
    assert mock.call_count == 2
