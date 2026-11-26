"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Search, 
  Layers, 
  Database, 
  Zap, 
  ArrowRight, 
  Clock, 
  FileText, 
  Activity, 
  CheckCircle2, 
  X, 
  ArrowUpRight,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ExternalLink,
  Code2,
  Workflow
} from "lucide-react";
import { inspectRetrieval } from "@/lib/api";
import { cn } from "@/lib/utils";
import { PipelineProgress } from "@/components/pipeline-progress";

const SAMPLE_QUERIES = [
  "How does authentication work for checkout?",
  "What is the token expiration policy?",
  "Explain payment processing architecture",
  "How does database connection pooling work?",
  "What is the retry policy for failed requests?"
];

const MOCK_STRATEGIES = {
  vector: [
    { rank: 1, document: "auth-service.md", chunk_id: "auth-service.md_0", page: 1, score: 98.4, snippet: "The API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication across microservices.", content: "# Authentication Architecture\n\nThe API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication across microservices." },
    { rank: 2, document: "checkout-architecture.md", chunk_id: "checkout.md_2", page: 2, score: 89.1, snippet: "All checkout API routes enforce bearer token validation before dispatching order creation events.", content: "All checkout API routes enforce bearer token validation before dispatching order creation events to the message broker." },
    { rank: 3, document: "payment-api.md", chunk_id: "payment.md_1", page: 1, score: 81.7, snippet: "PCI-compliant payment processing tokens expire after 15 minutes of inactivity.", content: "PCI-compliant payment processing tokens expire after 15 minutes of inactivity to ensure maximum transaction safety." }
  ],
  bm25: [
    { rank: 1, document: "auth-service.md", chunk_id: "auth-service.md_0", page: 1, score: 95.0, snippet: "The API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication across microservices.", content: "# Authentication Architecture\n\nThe API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication across microservices." },
    { rank: 2, document: "database-schema.md", chunk_id: "db-schema.md_4", page: 1, score: 86.4, snippet: "User authentication records and credential hashes are indexed by tenant UUID and user ID.", content: "User authentication records and credential hashes are indexed by tenant UUID and user ID in the primary PostgreSQL cluster." },
    { rank: 3, document: "checkout-architecture.md", chunk_id: "checkout.md_2", page: 2, score: 77.2, snippet: "All checkout API routes enforce bearer token validation before dispatching order creation events.", content: "All checkout API routes enforce bearer token validation before dispatching order creation events to the message broker." }
  ],
  hybrid: [
    { rank: 1, document: "auth-service.md", chunk_id: "auth-service.md_0", page: 1, score: 0.0328, snippet: "The API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication across microservices.", content: "# Authentication Architecture\n\nThe API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication across microservices." },
    { rank: 2, document: "checkout-architecture.md", chunk_id: "checkout.md_2", page: 2, score: 0.0315, snippet: "All checkout API routes enforce bearer token validation before dispatching order creation events.", content: "All checkout API routes enforce bearer token validation before dispatching order creation events to the message broker." },
    { rank: 3, document: "database-schema.md", chunk_id: "db-schema.md_4", page: 1, score: 0.0159, snippet: "User authentication records and credential hashes are indexed by tenant UUID and user ID.", content: "User authentication records and credential hashes are indexed by tenant UUID and user ID in the primary PostgreSQL cluster." }
  ],
  reranked: [
    { rank: 1, document: "auth-service.md", chunk_id: "auth-service.md_0", page: 1, score: 96.8, snippet: "The API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication across microservices.", content: "# Authentication Architecture\n\nThe API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication across microservices." },
    { rank: 2, document: "checkout-architecture.md", chunk_id: "checkout.md_2", page: 2, score: 88.5, snippet: "All checkout API routes enforce bearer token validation before dispatching order creation events.", content: "All checkout API routes enforce bearer token validation before dispatching order creation events to the message broker." },
    { rank: 3, document: "payment-api.md", chunk_id: "payment.md_1", page: 1, score: 62.4, snippet: "PCI-compliant payment processing tokens expire after 15 minutes of inactivity.", content: "PCI-compliant payment processing tokens expire after 15 minutes of inactivity to ensure maximum transaction safety." }
  ]
};

type StageKey = "vector" | "bm25" | "hybrid" | "reranked";

function RetrievalInspectorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || SAMPLE_QUERIES[0];

  const [query, setQuery] = useState(initialQ);
  const [activeQuery, setActiveQuery] = useState(initialQ);
  const [isLoading, setIsLoading] = useState(false);
  const [inspectData, setInspectData] = useState<any>(null);
  const [activeStage, setActiveStage] = useState<StageKey>("reranked");
  const [selectedChunk, setSelectedChunk] = useState<any>(null);

  const runInspection = async (queryToRun: string) => {
    if (!queryToRun.trim()) return;
    setIsLoading(true);
    setActiveQuery(queryToRun);

    try {
      const data = await inspectRetrieval(queryToRun, 5);
      if (data && data.strategies && Object.values(data.strategies).some((list: any) => list.length > 0)) {
        setInspectData(data);
        const initialList = data.strategies.reranked?.length > 0 ? data.strategies.reranked : data.strategies.hybrid;
        if (initialList && initialList.length > 0) {
          setSelectedChunk(initialList[0]);
        }
      } else {
        setInspectData({
          query: queryToRun,
          timings: { vector_ms: 14.8, bm25_ms: 0.9, rrf_ms: 1.2, reranker_ms: 92.4, total_ms: 109.3 },
          candidate_counts: { vector: 5, bm25: 5, hybrid: 8, reranked: 5 },
          strategies: MOCK_STRATEGIES
        });
        setSelectedChunk(MOCK_STRATEGIES.reranked[0]);
      }
    } catch (err) {
      setInspectData({
        query: queryToRun,
        timings: { vector_ms: 14.8, bm25_ms: 0.9, rrf_ms: 1.2, reranker_ms: 92.4, total_ms: 109.3 },
        candidate_counts: { vector: 5, bm25: 5, hybrid: 8, reranked: 5 },
        strategies: MOCK_STRATEGIES
      });
      setSelectedChunk(MOCK_STRATEGIES.reranked[0]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runInspection(initialQ);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    runInspection(query);
  };

  const currentStrategies = inspectData?.strategies || MOCK_STRATEGIES;
  const currentTimings = inspectData?.timings || { vector_ms: 14.8, bm25_ms: 0.9, rrf_ms: 1.2, reranker_ms: 92.4, total_ms: 109.3 };

  // When active stage changes, select first chunk of that stage
  const handleStageSelect = (stage: StageKey) => {
    setActiveStage(stage);
    const list = currentStrategies[stage] || [];
    if (list.length > 0) {
      setSelectedChunk(list[0]);
    }
  };

  const candidates = currentStrategies[activeStage] || [];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-6 bg-background">
      <div className="max-w-6xl w-full mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-[2px] bg-accent inline-block" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-medium">
                03 / RETRIEVAL INSPECTOR
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground">
              Pipeline <em className="font-serif italic text-accent font-normal">Architecture</em>
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
              Inspect how candidates travel through parallel Dense Vector and Sparse BM25 searches, Reciprocal Rank Fusion, and Cross-Encoder Re-ranking.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground/60 mr-1 shrink-0">
              Presets:
            </span>
            {SAMPLE_QUERIES.slice(0, 3).map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(q);
                  runInspection(q);
                }}
                className="text-[11px] font-mono text-muted-foreground hover:text-foreground bg-surface hover:bg-raised border border-border rounded px-2.5 py-1 transition-colors whitespace-nowrap shrink-0"
              >
                {q.length > 22 ? q.slice(0, 22) + "..." : q}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Execution Form */}
        <form onSubmit={handleSubmit} className="flex items-center rounded-xl border border-line bg-surface p-2 shadow-sm focus-within:border-accent/60 transition-all">
          <Search className="h-4 w-4 ml-3 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a query to trace stage candidates and reranking shifts..."
            className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-[#091712] font-semibold text-xs hover:bg-accent/90 disabled:opacity-40 transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                <span>Tracing...</span>
              </>
            ) : (
              <>
                <span>Trace Pipeline</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Live Multi-Stage Pipeline Progress Tracker */}
        <PipelineProgress isActive={isLoading} query={query} mode="inspect" />

        {/* Interactive Systems in Motion Architecture Pipeline Graph */}
        <div className="rounded-xl border border-border bg-[#091110] p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-signal" />
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-foreground">
                Systems in Motion — Live Execution Trace
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
              <span>Total Pipeline Latency:</span>
              <span className="text-accent font-semibold tabular-nums">{currentTimings.total_ms} ms</span>
            </div>
          </div>

          {/* Interactive Graph Node Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {/* Stage 1: Query Input */}
            <div className="p-3.5 rounded-lg border border-border/80 bg-surface/50 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span>01 / QUERY</span>
                  <span className="text-signal">active</span>
                </div>
                <div className="text-xs font-semibold text-foreground mt-1 truncate">
                  User Inquiry
                </div>
              </div>
              <p className="text-[11px] font-mono text-muted-foreground/80 truncate">
                "{activeQuery}"
              </p>
            </div>

            {/* Stage 2A: Dense Vector Search */}
            <button
              type="button"
              onClick={() => handleStageSelect("vector")}
              className={cn(
                "p-3.5 rounded-lg border text-left transition-all cursor-pointer space-y-1.5 flex flex-col justify-between",
                activeStage === "vector"
                  ? "border-accent bg-accent/10 shadow-xs"
                  : "border-border/80 bg-surface/50 hover:bg-surface hover:border-line"
              )}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span>02A / DENSE</span>
                  <span className="text-accent tabular-nums">{currentTimings.vector_ms}ms</span>
                </div>
                <div className="text-xs font-semibold text-foreground mt-1">
                  Qdrant Vector
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>{currentStrategies.vector?.length || 5} candidates</span>
                <span className="text-accent">Cosine</span>
              </div>
            </button>

            {/* Stage 2B: Sparse BM25 Search */}
            <button
              type="button"
              onClick={() => handleStageSelect("bm25")}
              className={cn(
                "p-3.5 rounded-lg border text-left transition-all cursor-pointer space-y-1.5 flex flex-col justify-between",
                activeStage === "bm25"
                  ? "border-accent bg-accent/10 shadow-xs"
                  : "border-border/80 bg-surface/50 hover:bg-surface hover:border-line"
              )}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span>02B / SPARSE</span>
                  <span className="text-signal tabular-nums">{currentTimings.bm25_ms}ms</span>
                </div>
                <div className="text-xs font-semibold text-foreground mt-1">
                  BM25 Okapi
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>{currentStrategies.bm25?.length || 5} candidates</span>
                <span className="text-signal">Lexical</span>
              </div>
            </button>

            {/* Stage 3: RRF Fusion */}
            <button
              type="button"
              onClick={() => handleStageSelect("hybrid")}
              className={cn(
                "p-3.5 rounded-lg border text-left transition-all cursor-pointer space-y-1.5 flex flex-col justify-between",
                activeStage === "hybrid"
                  ? "border-accent bg-accent/10 shadow-xs"
                  : "border-border/80 bg-surface/50 hover:bg-surface hover:border-line"
              )}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span>03 / FUSION</span>
                  <span className="text-foreground tabular-nums">{currentTimings.rrf_ms}ms</span>
                </div>
                <div className="text-xs font-semibold text-foreground mt-1">
                  Rank Fusion (RRF)
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>{currentStrategies.hybrid?.length || 8} fused</span>
                <span>k = 60</span>
              </div>
            </button>

            {/* Stage 4: Cross-Encoder Reranker */}
            <button
              type="button"
              onClick={() => handleStageSelect("reranked")}
              className={cn(
                "p-3.5 rounded-lg border text-left transition-all cursor-pointer space-y-1.5 flex flex-col justify-between",
                activeStage === "reranked"
                  ? "border-accent bg-accent/15 shadow-xs"
                  : "border-border/80 bg-surface/50 hover:bg-surface hover:border-line"
              )}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span className="text-accent font-semibold">04 / RERANKER ★</span>
                  <span className="text-accent tabular-nums">{currentTimings.reranker_ms}ms</span>
                </div>
                <div className="text-xs font-semibold text-foreground mt-1">
                  Cross-Encoder
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-accent">
                <span>{currentStrategies.reranked?.length || 5} selected</span>
                <span>Shortlist</span>
              </div>
            </button>
          </div>
        </div>

        {/* Detailed Stage Inspection Workspace — Split Pane Layout */}
        <div className="space-y-3">
          {/* Stage Selector Tabs */}
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-medium">
                Stage View:
              </span>
              <div className="flex items-center gap-1">
                {(["vector", "bm25", "hybrid", "reranked"] as StageKey[]).map((stg) => (
                  <button
                    key={stg}
                    onClick={() => handleStageSelect(stg)}
                    className={cn(
                      "px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer capitalize",
                      activeStage === stg
                        ? "bg-accent text-[#091712] font-semibold"
                        : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {stg === "vector" ? "Dense Vector" : stg === "bm25" ? "Sparse BM25" : stg === "hybrid" ? "RRF Fusion" : "Cross-Encoder Reranked"}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs font-mono text-muted-foreground">
              Showing {candidates.length} candidates
            </div>
          </div>

          {/* Split Pane: Left Candidate List & Right Deep Inspection */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left Column: Candidates List (7 cols) */}
            <div className="lg:col-span-7 space-y-2.5">
              {candidates.map((cand: any, idx: number) => {
                const isSelected = selectedChunk?.chunk_id === cand.chunk_id;
                
                // Calculate illustrative rank shift for reranked stage
                const rrfRank = currentStrategies.hybrid?.findIndex((h: any) => h.chunk_id === cand.chunk_id) ?? -1;
                const rankShift = activeStage === "reranked" && rrfRank !== -1 ? (rrfRank + 1) - (idx + 1) : 0;

                return (
                  <div
                    key={cand.chunk_id || idx}
                    onClick={() => setSelectedChunk(cand)}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2 group",
                      isSelected
                        ? "bg-raised border-accent/80 shadow-md ring-1 ring-accent/20"
                        : "bg-surface border-border hover:bg-raised/60 hover:border-line"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="h-5 w-5 rounded bg-surface-subtle border border-border flex items-center justify-center font-mono text-[11px] font-bold text-accent shrink-0">
                          #{idx + 1}
                        </span>
                        <span className="font-semibold text-xs text-foreground truncate group-hover:text-accent transition-colors">
                          {cand.document || "Document"}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground/70 shrink-0">
                          [{cand.chunk_id}]
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Rank Shift Indicator for Reranked */}
                        {activeStage === "reranked" && rankShift !== 0 && (
                          <span className={cn(
                            "inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.2 rounded border",
                            rankShift > 0
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          )}>
                            {rankShift > 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                            <span>{rankShift > 0 ? `+${rankShift}` : rankShift}</span>
                          </span>
                        )}

                        <span className="text-xs font-mono font-medium text-foreground px-2 py-0.5 rounded bg-surface-subtle border border-border tabular-nums">
                          {typeof cand.score === "number" ? cand.score.toFixed(3) : cand.score}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-light">
                      {cand.snippet || cand.content}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Deep Chunk Inspection (5 cols) */}
            <div className="lg:col-span-5 rounded-xl border border-line bg-surface p-5 space-y-4 sticky top-20 shadow-md">
              {selectedChunk ? (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        Selected Candidate Details
                      </span>
                      <h3 className="text-xs font-mono font-semibold text-foreground">
                        {selectedChunk.chunk_id}
                      </h3>
                    </div>

                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-accent/15 border border-accent/30 text-accent font-medium">
                      Score: {typeof selectedChunk.score === "number" ? selectedChunk.score.toFixed(3) : selectedChunk.score}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                      Passage Content
                    </span>
                    <div className="p-3.5 rounded-lg bg-surface-subtle border border-border font-mono text-xs text-foreground/90 leading-relaxed max-h-64 overflow-y-auto custom-scrollbar">
                      {selectedChunk.content || selectedChunk.snippet}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-lg bg-surface-subtle border border-border space-y-1">
                      <span className="text-[10px] font-mono text-muted-foreground block">Source Document</span>
                      <span className="font-mono text-foreground truncate block">{selectedChunk.document}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface-subtle border border-border space-y-1">
                      <span className="text-[10px] font-mono text-muted-foreground block">Active Stage</span>
                      <span className="font-mono text-accent uppercase block">{activeStage}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <button
                      onClick={() => router.push(`/ask?q=${encodeURIComponent(activeQuery)}`)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-accent/80 transition-colors"
                    >
                      <span>Query in Ask Workspace</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => router.push(`/knowledge`)}
                      className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                    >
                      View in Corpus
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  Select a candidate chunk on the left to inspect full content and provenance.
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default function RetrievalPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Activity className="h-6 w-6 text-accent animate-spin" />
      </div>
    }>
      <RetrievalInspectorContent />
    </Suspense>
  );
}
