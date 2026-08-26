# Project Progress

## Current Phase

Phase 1.6 - Real Retrieval & Generation Benchmark

## Status

IN PROGRESS

## Completed

- [x] Initial PRD review and architectural planning
- [x] Implementing Document Ingestion
- [x] Setting up Project Structure and Environments
- [x] Implementing Vector Store
- [x] Implementing BM25 Keyword Search
- [x] Implementing Hybrid Search
- [x] Implementing Re-ranker
- [x] Implementing Generation and Citations
- [x] Building FastAPI API
- [x] Setting up Evaluation Pipeline
- [x] Setting up CI/CD Tests
- [x] Phase 1: Setup and Basic Ingestion
- [x] Phase 1.5: Production Hardening & Verification
- [x] Phase 1.6: Real Retrieval & Generation Benchmark
- [x] Frontend M1: Product UI (Next.js App Router, shadcn/ui, Dark theme)
- [x] Frontend Redesign: Match Dashboard Command Center Mockup
- [x] Full Environment Setup & Dependencies Installed (Python venv, PyTorch, Node.js 22, PNPM, DB Seeding, Verified Pytest suite)
- [x] Fix Vector Store collection auto-creation bug (404 collection not found when Qdrant collection is missing in cloud)
- [x] Configure automated CD deployment to Vercel and Render in GitHub Actions
- [x] Fix database path parent directory creation bug in CI/CD pipeline (unable to open database file error during tests)
- [x] Add version_or_info field serialization to `/health/services` endpoint to allow dynamic subtext rendering in frontend
- [x] Make system Uptime and Environment dynamic in System Status card (calculated via backend server start time and read from environment variables)
- [x] Fix ModuleNotFoundError in eval scripts in CI/CD pipeline (import resolution errors for src package)
- [x] Add auto-seeding of benchmark corpus inside evaluation scripts when vector database is empty (fixing empty database failure in CI/CD pipeline)
- [x] Fix VertexAI import crash in Ragas library by dynamically mocking `langchain_community.chat_models.vertexai` inside `eval/ragas_eval.py`
- [x] Fix Ragas metrics import name mismatch (aliased `answer_relevancy` as `answer_relevance` in `eval/ragas_eval.py`)
- [x] Gracefully skip Ragas LLM metrics (faithfulness, answer relevance) inside `eval/ragas_eval.py` if `OPENAI_API_KEY` is missing in CI/CD pipeline (saving custom metrics baseline only)
- [x] Fix Vercel deploy directory path in CI/CD pipeline (removed duplicate working-directory configuration)
- [x] Fix Vercel inspect scope in CI/CD pipeline (configured team scope 'harshavardhankurtkotis-projects')
- [x] Replace third-party Vercel action with standard Vercel CLI `npx vercel` deployment to fully bypass scoping/inspection bugs
- [x] Frontend M2: AI Observability (Retrieval Inspector, Multi-Strategy Comparison, Telemetry Trace)
- [x] Frontend M3: System Observability (Service Topology, Pipeline Visualizer, Diagnostics, Telemetry Log)
- [x] Add `/retrieval/inspect` and `/system/diagnostics` FastAPI endpoints and verified with Pytest suite
- [x] Harmonize typography, serif italic cyan accents, badge pills, and glassmorphic styling across all 5 pages (`/ask`, `/knowledge`, `/retrieval`, `/evaluation`, `/system`)
- [x] Add non-blocking background telemetry forwarder (`src/observability/telemetry.py`) on `/query` endpoint to stream live traces into `prod_rag_monitoring`
- [x] Upgrade Groq LLM integration to active non-deprecated models (`openai/gpt-oss-120b`, `openai/gpt-oss-20b`) and verified with Pytest suite (15/15 tests passing)

## In Progress

- [/] Phase 1.6: Connect Ragas Evaluation Pipeline trigger UI with background worker

## Pending

- [ ] Advanced structure-aware parsing (e.g. LlamaParse integration) - See Backlog
- [ ] Semantic caching - See Backlog
- [ ] Distributed vector store environment (Qdrant) - See Backlog

## Current Task

Live observability, Langfuse distributed tracing, Groq active model integration (`openai/gpt-oss-120b`), and remote health probing connected with the Production RAG Monitoring Platform (`prod_rag_monitoring`), tested and verified with complete test suites passing in both repositories (15/15 and 22/22 tests).

## Next Step

Verify full end-to-end integration between deployed Next.js Vercel frontend, FastAPI backend, and monitoring platform.

## Blockers

None


