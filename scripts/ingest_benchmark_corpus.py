import os
import shutil
import time
from src.main import app
from fastapi.testclient import TestClient

client = TestClient(app)
CORPUS_DIR = "docs/corpus"

def clean_database():
    data_dir = "data"
    if os.path.exists(data_dir):
        print("Cleaning old data directory...")
        shutil.rmtree(data_dir)
        # Give it a moment to release file locks
        time.sleep(1)
        os.makedirs(data_dir)

def ingest_corpus():
    if not os.path.exists(CORPUS_DIR):
        print(f"Corpus directory {CORPUS_DIR} not found. Generate corpus first.")
        return
        
    for filename in os.listdir(CORPUS_DIR):
        if not filename.endswith(".md"):
            continue
            
        filepath = os.path.join(CORPUS_DIR, filename)
        with open(filepath, "rb") as f:
            response = client.post("/api/v1/ingest/file", files={"file": (filename, f, "text/markdown")})
            if response.status_code == 200:
                print(f"Successfully ingested {filename}")
            else:
                print(f"Failed to ingest {filename}: {response.text}")

if __name__ == "__main__":
    clean_database()
    ingest_corpus()
    print("Ingestion complete.")
