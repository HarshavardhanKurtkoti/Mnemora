import os
import requests
from src.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def ingest_test_doc():
    doc_content = """# Authentication
The API uses OAuth 2.0 for authentication.

# PRD
The system uses 100 token overlap.

# Context
X is good.
"""
    with open("test_doc.md", "w") as f:
        f.write(doc_content)
        
    with open("test_doc.md", "rb") as f:
        response = client.post("/api/v1/ingest/file", files={"file": ("test_doc.md", f, "text/markdown")})
        print(response.json())
        
if __name__ == "__main__":
    ingest_test_doc()
