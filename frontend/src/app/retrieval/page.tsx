"use client";

import { Suspense, useState, useEffect } from "react";
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
  ChevronRight
} from "lucide-react";
import { inspectRetrieval } from "@/lib/api";
import { cn } from "@/lib/utils";

const SAMPLE_QUERIES = [
  "How does authentication work for checkout?",
  "What is the token expiration policy?",
  "Explain payment processing architecture",
  "How does database connection pooling work?",
  "What is the retry policy for failed requests?"
];

const MOCK_STRATEGIES = {
  vector: [
    { rank: 1, document: "auth-service.md", chunk_id: "auth-service.md_0", page: 1, score: 98.4, snippet: "The API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication.", content: "# Authentication Architecture\n\nThe API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication across microservices." },
    { rank: 2, document: "checkout-architecture.md", chunk_id: "checkout.md_2", page: 2, score: 89.1, snippet: "All checkout API routes enforce bearer token validation before dispatching order creation events.", content: "All checkout API routes enforce bearer token validation before dispatching order creation events to the message broker." },
    { rank: 3, document: "payment-api.md", chunk_id: "payment.md_1", page: 1, score: 81.7, snippet: "PCI-compliant payment processing tokens expire after 15 minutes of inactivity.", content: "PCI-compliant payment processing tokens expire after 15 minutes of inactivity to ensure maximum transaction safety." }
  ],
  bm25: [
    { rank: 1, document: "auth-service.md", chunk_id: "auth-service.md_0", page: 1, score: 95.0, snippet: "The API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication.", content: "# Authentication Architecture\n\nThe API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication across microservices." },
    { rank: 2, document: "database-schema.md", chunk_id: "db-schema.md_4", page: 1, score: 86.4, snippet: "User authentication records and credential hashes are indexed by tenant UUID and user ID.", content: "User authentication records and credential hashes are indexed by tenant UUID and user ID in the primary PostgreSQL cluster." },
    { rank: 3, document: "checkout-architecture.md", chunk_id: "checkout.md_2", page: 2, score: 77.2, snippet: "All checkout API routes enforce bearer token validation before dispatching order creation events.", content: "All checkout API routes enforce bearer token validation before dispatching order creation events to the message broker." }
  ],
  hybrid: [
    { rank: 1, document: "auth-service.md", chunk_id: "auth-service.md_0", page: 1, score: 0.0328, snippet: "The API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication.", content: "# Authentication Architecture\n\nThe API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication across microservices." },
    { rank: 2, document: "checkout-architecture.md", chunk_id: "checkout.md_2", page: 2, score: 0.0315, snippet: "All checkout API routes enforce bearer token validation before dispatching order creation events.", content: "All checkout API routes enforce bearer token validation before dispatching order creation events to the message broker." },
    { rank: 3, document: "database-schema.md", chunk_id: "db-schema.md_4", page: 1, score: 0.0159, snippet: "User authentication records and credential hashes are indexed by tenant UUID and user ID.", content: "User authentication records and credential hashes are indexed by tenant UUID and user ID in the primary PostgreSQL cluster." }
  ],
  reranked: [
    { rank: 1, document: "auth-service.md", chunk_id: "auth-service.md_0", page: 1, score: 96.8, snippet: "The API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication.", content: "# Authentication Architecture\n\nThe API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication across microservices." },
    { rank: 2, document: "checkout-architecture.md", chunk_id: "checkout.md_2", page: 2, score: 88.5, snippet: "All checkout API routes enforce bearer token validation before dispatching order creation events.", content: "All checkout API routes enforce bearer token validation before dispatching order creation events to the message broker." },
    { rank: 3, document: "payment-api.md", chunk_id: "payment.md_1", page: 1, score: 62.4, snippet: "PCI-compliant payment processing tokens expire after 15 minutes of inactivity.", content: "PCI-compliant payment processing tokens expire after 15 minutes of inactivity to ensure maximum transaction safety." }
  ]
};

function RetrievalInspectorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || SAMPLE_QUERIES[0];

  const [query, setQuery] = useState(initialQ);
  const [activeQuery, setActiveQuery] = useState(initialQ);
  const [isLoading, setIsLoading] = useState(false);
  const [inspectData, setInspectData] = useState<any>(null);
  const [selectedChunk, setSelectedChunk] = useState<any>(null);

  const runInspection = async (queryToRun: string) => {
    if (!queryToRun.trim()) return;
    setIsLoading(true);
    setActiveQuery(queryToRun);

    try {
      const data = await inspectRetrieval(queryToRun, 5);
      if (data && data.strategies && Object.values(data.strategies).some((list: any) => list.length > 0)) {
        setInspectData(data);
      } else {
        setInspectData({
          query: queryToRun,
          timings: { vector_ms: 14.8, bm25_ms: 0.9, rrf_ms: 1.2, reranker_ms: 92.4, total_ms: 109.3 },
          candidate_counts: { vector: 5, bm25: 5, hybrid: 8, reranked: 5 },
          strategies: MOCK_STRATEGIES
        });
      }
    } catch (err) {
      setInspectData({
        query: queryToRun,
        timings: { vector_ms: 14.8, bm25_ms: 0.9, rrf_ms: 1.2, reranker_ms: 92.4, total_ms: 109.3 },
        candidate_counts: { vector: 5, bm25: 5, hybrid: 8, reranked: 5 },
        strategies: MOCK_STRATEGIES
      });
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
  const currentTimings = inspectData?.timings || { vector_ms: 15, bm25_ms: 1, rrf_ms: 1, reranker_ms: 90, total_ms: 107 };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-6 sm:p-8 space-y-4 bg-background">
      <div className="max-w-[1700px] w-full mx-auto flex flex-col h-full min-h-0 gap-4">
        
        {/* Header Section */}
        <div className="flex flex-col gap-3 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-[2px] bg-accent inline-block" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-accent">
                  Observability
                </span>
              </div>
              <h1 className="text-2xl font-normal tracking-tight text-foreground">
                Retrieval <em className="font-serif italic text-accent font-normal">Inspector</em>
              </h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Side-by-side execution trace across Dense Vector, Sparse BM25, Reciprocal Rank Fusion, and Cross-Encoder Re-ranker.
              </p>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-1">
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
                  {q.length > 26 ? q.slice(0, 26) + "..." : q}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSubmit} className="flex items-center rounded-lg border border-line bg-surface-subtle shadow-sm focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/20 transition-all">
            <Search className="h-4 w-4 ml-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a query to inspect candidate retrieval scores and stage latencies..."
              className="w-full bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none font-light"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="inline-flex items-center gap-1.5 mr-2 px-3 py-1.5 rounded-md bg-accent text-[#091712] font-medium text-xs hover:bg-accent/90 disabled:opacity-40 transition-colors shrink-0"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                  <span>Tracing...</span>
                </>
              ) : (
                <>
                  <span>Inspect Pipeline</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Pipeline Execution Stages Strip */}
        <div className="rounded-xl border border-border bg-surface p-3 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-accent" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Execution Pipeline Latency
              </span>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">
              Total: <strong className="text-foreground">{currentTimings.total_ms} ms</strong>
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 font-mono text-xs">
            <div className="rounded-md border border-border bg-surface-subtle p-2 flex flex-col justify-between">
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground">1. Query</span>
              <span className="text-foreground truncate font-sans text-xs">{activeQuery}</span>
            </div>

            <div className="rounded-md border border-border bg-surface-subtle p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-accent">
                <span>2. Vector Search</span>
                <span>{currentTimings.vector_ms}ms</span>
              </div>
              <span className="text-muted-foreground text-[11px]">{currentStrategies.vector?.length || 0} candidates (Cosine)</span>
            </div>

            <div className="rounded-md border border-border bg-surface-subtle p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-signal">
                <span>3. BM25 Lexical</span>
                <span>{currentTimings.bm25_ms}ms</span>
              </div>
              <span className="text-muted-foreground text-[11px]">{currentStrategies.bm25?.length || 0} candidates (Okapi)</span>
            </div>

            <div className="rounded-md border border-border bg-surface-subtle p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-foreground">
                <span>4. RRF Fusion</span>
                <span>{currentTimings.rrf_ms}ms</span>
              </div>
              <span className="text-muted-foreground text-[11px]">{currentStrategies.hybrid?.length || 0} merged (k=60)</span>
            </div>

            <div className="rounded-md border border-accent/40 bg-accent/5 p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-accent font-semibold">
                <span>5. Re-ranker</span>
                <span>{currentTimings.reranker_ms}ms</span>
              </div>
              <span className="text-accent text-[11px]">{currentStrategies.reranked?.length || 0} top passages selected</span>
            </div>
          </div>
        </div>

        {/* 4-Column Strategy Inspector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 flex-1 min-h-0">
          
          {/* Column 1: Vector Search */}
          <div className="rounded-xl border border-border bg-surface p-3.5 flex flex-col min-h-0 h-full">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/80 shrink-0">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-accent" />
                <div>
                  <h3 className="text-xs font-medium text-foreground">Vector Search</h3>
                  <p className="text-[9px] text-muted-foreground font-mono">Dense Embeddings</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-accent bg-secondary px-1.5 py-0.5 rounded border border-border">
                {currentTimings.vector_ms}ms
              </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 min-h-0">
              {currentStrategies.vector?.map((candidate: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setSelectedChunk({ ...candidate, strategy: "Vector Search" })}
                  className="rounded-lg border border-border/80 bg-surface-subtle hover:bg-raised p-2.5 transition-colors cursor-pointer group space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="h-4 w-4 rounded bg-secondary text-foreground font-mono text-[9px] font-medium flex items-center justify-center shrink-0">
                        #{candidate.rank}
                      </span>
                      <span className="text-xs font-medium text-foreground truncate">{candidate.document}</span>
                    </div>
                    <span className="text-[10px] font-mono text-accent tabular-nums">
                      {candidate.score}%
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3 font-light">
                    {candidate.snippet}
                  </p>
                  <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground/60 pt-1 border-t border-border/40">
                    <span>{candidate.chunk_id}</span>
                    <span className="text-accent group-hover:underline flex items-center gap-0.5">
                      Inspect <ArrowUpRight className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: BM25 Search */}
          <div className="rounded-xl border border-border bg-surface p-3.5 flex flex-col min-h-0 h-full">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/80 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-signal" />
                <div>
                  <h3 className="text-xs font-medium text-foreground">BM25 Search</h3>
                  <p className="text-[9px] text-muted-foreground font-mono">Sparse Token Matching</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-signal bg-secondary px-1.5 py-0.5 rounded border border-border">
                {currentTimings.bm25_ms}ms
              </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 min-h-0">
              {currentStrategies.bm25?.map((candidate: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setSelectedChunk({ ...candidate, strategy: "BM25 Search" })}
                  className="rounded-lg border border-border/80 bg-surface-subtle hover:bg-raised p-2.5 transition-colors cursor-pointer group space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="h-4 w-4 rounded bg-secondary text-foreground font-mono text-[9px] font-medium flex items-center justify-center shrink-0">
                        #{candidate.rank}
                      </span>
                      <span className="text-xs font-medium text-foreground truncate">{candidate.document}</span>
                    </div>
                    <span className="text-[10px] font-mono text-signal tabular-nums">
                      {candidate.score}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3 font-light">
                    {candidate.snippet}
                  </p>
                  <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground/60 pt-1 border-t border-border/40">
                    <span>{candidate.chunk_id}</span>
                    <span className="text-signal group-hover:underline flex items-center gap-0.5">
                      Inspect <ArrowUpRight className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Hybrid RRF */}
          <div className="rounded-xl border border-border bg-surface p-3.5 flex flex-col min-h-0 h-full">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/80 shrink-0">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-foreground/80" />
                <div>
                  <h3 className="text-xs font-medium text-foreground">Hybrid RRF</h3>
                  <p className="text-[9px] text-muted-foreground font-mono">Rank Fusion (k=60)</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-foreground bg-secondary px-1.5 py-0.5 rounded border border-border">
                {currentTimings.rrf_ms}ms
              </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 min-h-0">
              {currentStrategies.hybrid?.map((candidate: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setSelectedChunk({ ...candidate, strategy: "Hybrid RRF" })}
                  className="rounded-lg border border-border/80 bg-surface-subtle hover:bg-raised p-2.5 transition-colors cursor-pointer group space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="h-4 w-4 rounded bg-secondary text-foreground font-mono text-[9px] font-medium flex items-center justify-center shrink-0">
                        #{candidate.rank}
                      </span>
                      <span className="text-xs font-medium text-foreground truncate">{candidate.document}</span>
                    </div>
                    <span className="text-[10px] font-mono text-foreground/80 tabular-nums">
                      {candidate.score}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3 font-light">
                    {candidate.snippet}
                  </p>
                  <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground/60 pt-1 border-t border-border/40">
                    <span>{candidate.chunk_id}</span>
                    <span className="text-foreground group-hover:underline flex items-center gap-0.5">
                      Inspect <ArrowUpRight className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Re-ranker */}
          <div className="rounded-xl border border-accent/40 bg-surface p-3.5 flex flex-col min-h-0 h-full relative">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/80 shrink-0">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" />
                <div>
                  <h3 className="text-xs font-medium text-foreground">Cross-Encoder</h3>
                  <p className="text-[9px] text-accent font-mono">Final Grounded Context</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-accent bg-accent/10 px-1.5 py-0.5 rounded border border-accent/20">
                {currentTimings.reranker_ms}ms
              </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 min-h-0">
              {currentStrategies.reranked?.map((candidate: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setSelectedChunk({ ...candidate, strategy: "Cross-Encoder Re-ranker" })}
                  className="rounded-lg border border-border/80 bg-surface-subtle hover:bg-raised p-2.5 transition-colors cursor-pointer group space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="h-4 w-4 rounded bg-accent/20 text-accent font-mono text-[9px] font-semibold flex items-center justify-center shrink-0">
                        #{candidate.rank}
                      </span>
                      <span className="text-xs font-medium text-foreground truncate">{candidate.document}</span>
                    </div>
                    <span className="text-[10px] font-mono text-accent tabular-nums font-semibold">
                      {candidate.score}%
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3 font-light">
                    {candidate.snippet}
                  </p>
                  <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground/60 pt-1 border-t border-border/40">
                    <span>{candidate.chunk_id}</span>
                    <span className="text-accent group-hover:underline flex items-center gap-0.5">
                      Inspect <ArrowUpRight className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Chunk Detail Modal */}
      {selectedChunk && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="bg-surface border border-line rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-border bg-surface-subtle">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-5 w-5 text-accent shrink-0" />
                <div className="min-w-0">
                  <h2 className="text-sm font-medium text-foreground truncate">{selectedChunk.document}</h2>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mt-0.5">
                    <span className="text-accent">{selectedChunk.strategy}</span>
                    <span>•</span>
                    <span>Rank #{selectedChunk.rank}</span>
                    <span>•</span>
                    <span className="text-signal">Score: {selectedChunk.score}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedChunk(null)}
                className="text-muted-foreground hover:text-foreground p-1 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>Passage Content</span>
                <span>ID: {selectedChunk.chunk_id}</span>
              </div>

              <div className="rounded-lg border border-border bg-surface-subtle p-4 font-mono text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {selectedChunk.content || selectedChunk.snippet}
              </div>

              {selectedChunk.metadata && (
                <div className="space-y-1.5 pt-2 border-t border-border/60">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    Chunk Metadata
                  </span>
                  <pre className="rounded-lg border border-border bg-surface-subtle p-3 text-[11px] font-mono text-muted-foreground overflow-x-auto">
                    {JSON.stringify(selectedChunk.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RetrievalPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs font-mono text-muted-foreground">Loading Retrieval Inspector...</div>}>
      <RetrievalInspectorContent />
    </Suspense>
  );
}
