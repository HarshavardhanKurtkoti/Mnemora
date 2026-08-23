
# Project 1 — Production-Grade Retrieval-Augmented Generation (RAG) System

## 🎯 Goal

Build a **production-grade, domain-specific "Ask My Documents" RAG system**.

The system should:

* Ingest documents such as PDFs, Markdown files, and web pages.
* Parse and clean the documents.
* Split documents into meaningful chunks.
* Generate embeddings and store them in a vector database.
* Retrieve relevant information for a user query.
* Combine semantic and keyword-based retrieval.
* Re-rank retrieved chunks for better precision.
* Generate answers grounded only in retrieved evidence.
* Provide **citations pointing to the exact source/chunk** used for the answer.
* Refuse to answer when sufficient evidence is unavailable.
* Include an evaluation pipeline to measure RAG quality.
* Run evaluations automatically in CI so quality regressions can block a build.

The goal is **not to build another basic chatbot**.

The goal is to demonstrate that I understand how to build, evaluate, and operate a real-world RAG system.

---

# Phase 1 — RAG Fundamentals

## 1. Document Ingestion

Support multiple document types:

* PDF
* Markdown
* TXT
* Web pages

Pipeline:

```text
Document
   ↓
Loader
   ↓
Text Extraction
   ↓
Cleaning / Normalization
   ↓
Chunking
   ↓
Metadata Enrichment
   ↓
Embedding
   ↓
Vector Database
```

Each chunk should contain metadata such as:

```text
document_id
document_name
source
page_number
chunk_id
section
created_at
```

This metadata will later be used for citations and debugging.

---

## 2. Chunking

Start with approximately:

* **500–800 tokens per chunk**
* **~100 token overlap**

The overlap prevents important context from being lost at chunk boundaries.

However, chunking should eventually become **structure-aware** rather than blindly splitting every N tokens.

For example:

```text
Document
 ├── Section
 │    ├── Paragraph
 │    ├── Paragraph
 │    └── Paragraph
 └── Section
      ├── Paragraph
      └── Paragraph
```

The system should attempt to keep related content together.

---

## 3. Embeddings

Convert each chunk into a vector representation.

```text
Chunk
  ↓
Embedding Model
  ↓
Vector
  ↓
Vector Database
```

The embedding model should be configurable so that it can be changed without rewriting the entire pipeline.

---

## 4. Vector Store

Possible choices:

* ChromaDB
* Weaviate
* Qdrant

For the first implementation, choose one and keep the storage layer abstract enough that another vector database can be substituted later.

---

# Phase 1 Retrieval Pipeline

For every user query:

```text
User Query
    ↓
Query Embedding
    ↓
Vector Search
    ↓
Top-K Chunks
    ↓
Prompt Construction
    ↓
LLM
    ↓
Answer + Citations
```

The system should retrieve the most relevant chunks before asking the LLM to answer.

The LLM should **not be allowed to freely answer from its own knowledge** when the task requires information from the document corpus.

---

# Citation System

Every factual claim should be traceable back to retrieved evidence.

Example:

```text
Answer:

The system uses X to perform authentication.

[1] authentication.md — Section 3
[2] architecture.pdf — Page 14
```

The citation should ideally contain:

```text
Document
Page / Section
Chunk ID
Relevant source text
```

This makes the system auditable.

---

# Phase 2 — Production-Quality Retrieval

The biggest upgrade from a basic RAG demo is **hybrid retrieval**.

## Hybrid Search

Combine:

### 1. Semantic Search

Uses embeddings to understand meaning.

Example:

```text
"How do I reset my password?"
```

can match:

```text
"Procedure for recovering account credentials"
```

even though the wording is different.

### 2. BM25 Keyword Search

Useful when exact terms matter.

Example:

```text
"ERR_CONNECTION_RESET"
```

A keyword search can be much better at finding an exact technical error code than pure semantic search.

---

## Hybrid Retrieval

```text
                 ┌── Vector Search ──┐
User Query ──────┤                   ├──→ Candidate Chunks
                 └── BM25 Search ────┘
                           ↓
                    Merge / Fusion
                           ↓
                    Top-N Candidates
```

The system should combine both retrieval methods instead of relying exclusively on vector similarity.

---

# Re-Ranking

Initial retrieval should prioritize recall.

Then use a **cross-encoder / re-ranker** to improve precision.

```text
Query
  ↓
Hybrid Retrieval
  ↓
Top 20–50 Candidates
  ↓
Cross Encoder
  ↓
Re-ranked Top 5–10
  ↓
LLM
```

A cross-encoder evaluates:

```text
(Query, Chunk)
```

together and assigns a relevance score.

Possible tools:

* Cohere Rerank
* Sentence Transformers cross-encoder models

---

# Citation Enforcement / Anti-Hallucination

The system should have an explicit rule:

> If the retrieved evidence does not support the answer, do not answer from general model knowledge.

Instead:

```text
"I couldn't find sufficient information in the provided documents
to answer this question."
```

This is an important distinction between:

```text
RAG Demo
```

and

```text
Production RAG System
```

---

# Prompt Management

Prompts should **not be hardcoded throughout the application**.

Store them as versioned configuration.

Example:

```text
prompts/
├── system_v1.txt
├── system_v2.txt
├── answer_v1.txt
└── citation_v1.txt
```

Prompt changes should be treated similarly to code changes because they can change system behavior.

---

# Phase 3 — Evaluation & Shipping

## Golden Dataset

Create a manually verified evaluation dataset.

Target:

**50–200 QA pairs**

Example:

```json
{
  "question": "How does authentication work?",
  "expected_answer": "...",
  "expected_sources": [
    "authentication.md"
  ]
}
```

The dataset should contain different categories:

* Easy factual questions
* Multi-hop questions
* Questions requiring exact terminology
* Questions with no answer in the corpus
* Questions designed to expose hallucinations
* Questions requiring multiple sources

---

# RAG Evaluation

Measure more than whether the answer "looks good."

Important metrics:

### Retrieval

* Context Precision
* Context Recall
* Retrieval Hit Rate
* Re-ranking effectiveness

### Generation

* Faithfulness
* Answer Relevance
* Citation Accuracy
* Citation Coverage

### System

* Latency
* Token usage
* Cost per query
* Failure rate

Possible evaluation framework:

**Ragas**

---

# Faithfulness

One of the most important metrics.

Question:

> Are the claims made by the LLM actually supported by the retrieved context?

Example:

```text
Retrieved evidence:
"The API uses OAuth 2.0."

Generated answer:
"The API uses OAuth 2.0 and supports SAML."

```

If the retrieved context only supports OAuth 2.0, the second claim is unsupported.

The system should detect this.

---

# CI / Regression Testing

Evaluation should become part of the development workflow.

```text
Developer Push
      ↓
CI Pipeline
      ↓
Run Tests
      ↓
Run RAG Evaluation
      ↓
Compare Metrics
      ↓
Quality Pass?
   ↙          ↘
 YES           NO
  ↓             ↓
Merge       Fail Build
```

Example quality gates:

```text
Faithfulness      ≥ 0.85
Answer Relevance  ≥ 0.80
Citation Coverage ≥ 0.90
Retrieval Recall  ≥ 0.85
```

The exact thresholds should be determined from the baseline rather than arbitrarily chosen.

---

# Proposed Architecture

```text
                    ┌─────────────────┐
                    │      User       │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │    API Layer    │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Query Processor │
                    └────────┬────────┘
                             ↓
              ┌──────────────┴──────────────┐
              ↓                             ↓
       ┌─────────────┐              ┌─────────────┐
       │ Vector Search│              │ BM25 Search │
       └──────┬──────┘              └──────┬──────┘
              └──────────────┬──────────────┘
                             ↓
                    ┌─────────────────┐
                    │ Result Fusion   │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │    Re-ranker    │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Context Builder │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │       LLM       │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Answer + Source │
                    │   Citations     │
                    └─────────────────┘
```

---

# Recommended Tech Stack

## Backend

* Python
* FastAPI

## AI / Orchestration

* LangChain or LangGraph

## Embeddings

* Configurable embedding model

## Vector Database

Choose one:

* Qdrant
* ChromaDB
* Weaviate

## Keyword Search

* BM25

## Re-ranking

* Cohere Rerank
* Sentence Transformers Cross-Encoder

## LLM

Use a configurable provider rather than tightly coupling the application to one model.

## Evaluation

* Ragas
* Custom evaluation scripts

## Testing

* Pytest

## CI

* GitHub Actions

## Configuration

* Pydantic Settings
* Versioned YAML/JSON/config files

---

# What Makes This Portfolio-Worthy?

A basic RAG project demonstrates:

```text
"I know how to call an LLM."
```

This project should demonstrate:

```text
"I understand retrieval systems,
information grounding,
ranking,
evaluation,
observability,
failure handling,
and production engineering."
```

The important part is not the UI.

The important part is being able to explain **why every component exists and how changing it affects system quality.**

---

# Final Deliverables

The finished project should contain:

* [ ] Document ingestion pipeline
* [ ] PDF/Markdown/web loaders
* [ ] Structure-aware chunking
* [ ] Embedding pipeline
* [ ] Vector database
* [ ] Semantic retrieval
* [ ] BM25 retrieval
* [ ] Hybrid retrieval
* [ ] Cross-encoder re-ranking
* [ ] Citation generation
* [ ] Citation validation
* [ ] Evidence-based answering
* [ ] "Insufficient evidence" refusal behavior
* [ ] Versioned prompts
* [ ] 50–200 question golden dataset
* [ ] RAG evaluation pipeline
* [ ] Faithfulness measurement
* [ ] Retrieval metrics
* [ ] CI quality gates
* [ ] Tests
* [ ] API documentation
* [ ] Architecture diagram
* [ ] Technical README
* [ ] Benchmark / evaluation report

---

# What I Should Be Able to Explain in an Interview

By the end of this project, I should be able to answer:

1. Why isn't vector search alone enough?
2. When does BM25 outperform semantic search?
3. How does hybrid retrieval work?
4. Why do we need a re-ranker?
5. How does a cross-encoder differ from a bi-encoder?
6. How do chunk size and overlap affect retrieval quality?
7. How do you prevent RAG hallucinations?
8. How do you determine whether a citation actually supports a claim?
9. How do you evaluate RAG systems objectively?
10. What is faithfulness?
11. What happens when the answer doesn't exist in the corpus?
12. How would you debug poor retrieval?
13. How would you reduce RAG latency?
14. How would you reduce token/cost usage?
15. How do you prevent a code or prompt change from silently degrading RAG quality?

---

# Core Portfolio Story

The project should tell this story:

**Ingest → Retrieve → Rank → Generate → Cite → Evaluate → Gate → Ship**

That is the difference between building an **LLM demo** and demonstrating **AI engineering**.
