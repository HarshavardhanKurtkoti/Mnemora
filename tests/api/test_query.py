from fastapi.testclient import TestClient
from src.main import app
from src.api.routes import get_hybrid_search, get_reranker, get_generation

client = TestClient(app)

# Mock dependencies to avoid loading models and API keys during basic API tests
def mock_hybrid_search():
    pass
def mock_reranker():
    pass
def mock_generation():
    pass

app.dependency_overrides[get_hybrid_search] = mock_hybrid_search
app.dependency_overrides[get_reranker] = mock_reranker
app.dependency_overrides[get_generation] = mock_generation

def test_empty_query():
    response = client.post("/api/v1/query", json={"query": "   "})
    assert response.status_code == 400
    assert "Empty query provided" in response.json()["detail"]

def test_missing_query():
    response = client.post("/api/v1/query", json={})
    assert response.status_code == 422 # Pydantic validation error
