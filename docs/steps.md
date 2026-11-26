# Project Progress

## Current Phase

Phase 1.7 - Complete UI/UX Refactor & Shared Portfolio Design System (HK Design System)

## Status

COMPLETE

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
- [x] Phase 1.7: Create dedicated branch `refactor/portfolio-design-system`
- [x] Phase 1.7: Extract design tokens directly from Harsha Kurtkoti's portfolio (`Portflio_website/src/index.css`)
- [x] Phase 1.7: Eliminate AI-generated cyberpunk aesthetic (removed `/bg.jpg`, neon cyan/purple glow drop-shadows, fake circular uptime rings, command-center sci-fi branding)
- [x] Phase 1.7: Rebuild application shell (`layout.tsx`, `header.tsx`, `sidebar.tsx`) with compact responsive navigation
- [x] Phase 1.7: Redesign `/ask` page: hero question composer, grounded answers, expandable source passages, latency breakdown
- [x] Phase 1.7: Redesign `/knowledge` page: professional document workspace, clean table, format badges, upload modal, document preview drawer
- [x] Phase 1.7: Redesign `/retrieval` page: flagship inspectable multi-stage pipeline across Dense Vector, Sparse BM25, RRF Fusion, and Cross-Encoder Re-ranker
- [x] Phase 1.7: Redesign `/evaluation` page: Ragas quality standards, strategy comparison chart & benchmark table
- [x] Phase 1.7: Redesign `/system` page: service topology, pipeline execution flow, runtime configuration inspector, audit log
- [x] Phase 1.7: Document reusable HK Design System in `docs/DESIGN_SYSTEM.md`
- [x] Phase 1.7: Verified full production frontend build (`pnpm build`) with zero TypeScript errors
- [x] Phase 1.7: Verified backend test suite with 15/15 tests passing

## In Progress

None

## Pending

- [ ] Advanced structure-aware parsing (e.g. LlamaParse integration) - See Backlog
- [ ] Semantic caching - See Backlog
- [ ] Distributed vector store environment (Qdrant) - See Backlog

## Current Task

Complete UI/UX refactor aligning Mnemora with Harsha Kurtkoti's portfolio identity (`refactor/portfolio-design-system`), with all 5 pages redesigned, shared design system documented in `docs/DESIGN_SYSTEM.md`, and all tests passing.

## Next Step

Submit branch `refactor/portfolio-design-system` for review and adopt the same design tokens in `prod_rag_monitoring` and `VisionBoard`.

## Blockers

None
