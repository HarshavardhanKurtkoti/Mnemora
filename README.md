# Mnemora RAG System

Mnemora is a production-grade, domain-specific Retrieval-Augmented Generation (RAG) system built with FastAPI, LangChain, ChromaDB, and local Re-ranking models.

## Architecture Pipeline

```text
Ingest (PDF/MD/TXT/Web)
  ↓
Parse (Langchain Document Loaders)
  ↓
Chunk (Structure-aware + tiktoken-aware)
  ↓
Embed (OpenAI/HuggingFace)
  ↓
Store (ChromaDB + BM25 Index)
  ↓
Query
  ↓
Vector + BM25 (Hybrid Retrieval)
  ↓
RRF (Reciprocal Rank Fusion)
  ↓
Cross Encoder (Re-ranking)
  ↓
LLM (Structured JSON Output via OpenAI/Local)
  ↓
Citation Validation (Backend-enforced chunk checks)
  ↓
Answer + Verified Sources
```

## Features
- **Strict Citation Validation:** Fabricated citations trigger an LLM retry; if persistent, the system safely falls back to "Insufficient evidence".
- **Token-Aware Chunking:** Uses `tiktoken` to respect OpenAI context window limitations instead of blunt character counting.
- **Deterministic Evaluation:** Provides Recall@K, HitRate@K, and MRR@K metrics for Vector, BM25, and Hybrid pipelines.
- **CI/CD Baselines:** Evaluates `ragas` metrics (Faithfulness, Answer Relevance) against a saved baseline to detect regressions automatically.

## Usage
1. `pip install -r requirements.txt`
2. Configure `.env` (`OPENAI_API_KEY`).
3. Run `uvicorn src.main:app --reload`.

## Benchmark Results (v1.6)
The system was evaluated against a synthetic technical corpus (12 documents, 60 questions).
- **Vector Search (Recall@5)**: 0.517
- **BM25 (Recall@5)**: 0.427
- **Hybrid RRF (Recall@5)**: 0.487
- **Hybrid + Cross-Encoder (Recall@5)**: 0.490
*Note: Reranker adds ~80ms to p95 latency. Full report available in `eval/results/benchmark_report.md`.*
