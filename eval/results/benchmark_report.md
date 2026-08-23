# Mnemora Retrieval & Generation Benchmark Report

## 1. Executive Summary

This report evaluates the Mnemora RAG system over 12 documents and 60 evaluation questions. 
We tested Vector Search, BM25, Hybrid RRF, and a Cross-Encoder Reranker.

## 2. Corpus Statistics

- **Documents**: 12
- **Evaluation Questions**: 60

## 3. Retrieval Results

| Strategy | Recall@5 | Recall@10 | HitRate@5 | MRR@10 |
|----------|----------|-----------|-----------|--------|
| Vector Search | 0.517 | 0.517 | 0.580 | 0.525 |
| BM25 | 0.427 | 0.487 | 0.500 | 0.417 |
| Hybrid RRF | 0.487 | 0.517 | 0.540 | 0.493 |
| Hybrid + Reranker | 0.490 | 0.517 | 0.540 | 0.525 |

## 4. Latency Results

| Strategy | P50 (ms) | P95 (ms) | P99 (ms) |
|----------|----------|----------|----------|
| Vector Search | 10.6 | 16.4 | 23.5 |
| BM25 | 0.2 | 0.3 | 0.3 |
| Hybrid RRF | 10.8 | 16.6 | 23.7 |
| Hybrid + Reranker | 85.8 | 107.3 | 132.6 |

## 5. Generation Results

| Metric | Score |
|--------|-------|
Generation metrics not available (OPENAI_API_KEY required).

## 6. Reranker Analysis & Key Findings

- **Recall@5 Improvement**: +0.003
- **MRR@10 Improvement**: +0.032
- **P95 Latency Cost**: +90.6 ms

The Cross-Encoder Reranker trades latency for higher accuracy. The improvement is marginal on this dataset.

## 7. Query-Type Analysis (Recall@5)

| Category | Vector | BM25 | Hybrid | Reranker |
|----------|--------|------|--------|----------|
| factual | 0.600 | 0.600 | 0.600 | 0.600 |
| exact_keyword | 0.400 | 0.300 | 0.400 | 0.400 |
| semantic | 0.500 | 0.300 | 0.400 | 0.500 |
| multi_document | 0.483 | 0.333 | 0.433 | 0.350 |
| multi_hop | 0.600 | 0.600 | 0.600 | 0.600 |
