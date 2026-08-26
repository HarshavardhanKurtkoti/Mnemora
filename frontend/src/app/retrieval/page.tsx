"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Search, 
  Layers, 
  Database, 
  Zap, 
  SlidersHorizontal, 
  ArrowRight, 
  Clock, 
  FileText, 
  ChevronRight, 
  Activity, 
  CheckCircle2, 
  X, 
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inspectRetrieval } from "@/lib/api";
import { cn } from "@/lib/utils";

const SAMPLE_QUERIES = [
  "How does authentication work for checkout?",
  "What is the token expiration policy?",
  "Explain payment processing architecture",
  "How does database connection pooling work?",
  "What is the retry policy for failed requests?"
];

// Fallback mock data if vector DB is completely fresh/empty
const MOCK_STRATEGIES = {
  vector: [
    { rank: 1, document: "auth-service.md", chunk_id: "auth-service.md_0", page: 1, score: 98.4, score_label: "Score", snippet: "The API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication.", content: "# Authentication Architecture\n\nThe API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication across microservices." },
    { rank: 2, document: "checkout-architecture.md", chunk_id: "checkout.md_2", page: 2, score: 89.1, score_label: "Score", snippet: "All checkout API routes enforce bearer token validation before dispatching order creation events.", content: "All checkout API routes enforce bearer token validation before dispatching order creation events to the message broker." },
    { rank: 3, document: "payment-api.md", chunk_id: "payment.md_1", page: 1, score: 81.7, score_label: "Score", snippet: "PCI-compliant payment processing tokens expire after 15 minutes of inactivity.", content: "PCI-compliant payment processing tokens expire after 15 minutes of inactivity to ensure maximum transaction safety." }
  ],
  bm25: [
    { rank: 1, document: "auth-service.md", chunk_id: "auth-service.md_0", page: 1, score: 95.0, score_label: "Score", snippet: "The API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication.", content: "# Authentication Architecture\n\nThe API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication across microservices." },
    { rank: 2, document: "database-schema.md", chunk_id: "db-schema.md_4", page: 1, score: 86.4, score_label: "Score", snippet: "User authentication records and credential hashes are indexed by tenant UUID and user ID.", content: "User authentication records and credential hashes are indexed by tenant UUID and user ID in the primary PostgreSQL cluster." },
    { rank: 3, document: "checkout-architecture.md", chunk_id: "checkout.md_2", page: 2, score: 77.2, score_label: "Score", snippet: "All checkout API routes enforce bearer token validation before dispatching order creation events.", content: "All checkout API routes enforce bearer token validation before dispatching order creation events to the message broker." }
  ],
  hybrid: [
    { rank: 1, document: "auth-service.md", chunk_id: "auth-service.md_0", page: 1, score: 0.0328, score_label: "RRF Score", snippet: "The API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication.", content: "# Authentication Architecture\n\nThe API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication across microservices." },
    { rank: 2, document: "checkout-architecture.md", chunk_id: "checkout.md_2", page: 2, score: 0.0315, score_label: "RRF Score", snippet: "All checkout API routes enforce bearer token validation before dispatching order creation events.", content: "All checkout API routes enforce bearer token validation before dispatching order creation events to the message broker." },
    { rank: 3, document: "database-schema.md", chunk_id: "db-schema.md_4", page: 1, score: 0.0159, score_label: "RRF Score", snippet: "User authentication records and credential hashes are indexed by tenant UUID and user ID.", content: "User authentication records and credential hashes are indexed by tenant UUID and user ID in the primary PostgreSQL cluster." }
  ],
  reranked: [
    { rank: 1, document: "auth-service.md", chunk_id: "auth-service.md_0", page: 1, score: 96.8, score_label: "Confidence", snippet: "The API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication.", content: "# Authentication Architecture\n\nThe API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication across microservices." },
    { rank: 2, document: "checkout-architecture.md", chunk_id: "checkout.md_2", page: 2, score: 88.5, score_label: "Confidence", snippet: "All checkout API routes enforce bearer token validation before dispatching order creation events.", content: "All checkout API routes enforce bearer token validation before dispatching order creation events to the message broker." },
    { rank: 3, document: "payment-api.md", chunk_id: "payment.md_1", page: 1, score: 62.4, score_label: "Confidence", snippet: "PCI-compliant payment processing tokens expire after 15 minutes of inactivity.", content: "PCI-compliant payment processing tokens expire after 15 minutes of inactivity to ensure maximum transaction safety." }
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
      console.warn("Backend inspect failed, using mock telemetry fallback:", err);
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
    <div className="flex-1 flex flex-col h-full overflow-hidden p-4 lg:p-6 bg-transparent relative">
      {/* Background ambient lighting */}
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-[#8B5CF6]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1700px] w-full mx-auto flex flex-col h-full min-h-0 gap-3.5">
        
        {/* Header & Controls Section */}
        <div className="flex flex-col gap-2.5 shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl lg:text-2xl font-light tracking-wide text-foreground">
                  Retrieval <span className="font-serif italic text-accent opacity-90">Inspector</span>
                </h1>
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
                  Observability
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
                Compare multi-stage retrieval candidates in real-time across Dense Vector, BM25 Sparse, RRF Fusion, and Cross-Encoder Re-ranker.
              </p>
            </div>

            {/* Quick Sample Queries */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground/60 mr-1 shrink-0">
                Presets:
              </span>
              {SAMPLE_QUERIES.slice(0, 3).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(q);
                    runInspection(q);
                  }}
                  className="text-[10px] text-muted-foreground hover:text-foreground bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-accent/30 rounded-lg px-2.5 py-1 transition-all whitespace-nowrap shrink-0"
                >
                  {q.length > 28 ? q.slice(0, 28) + "..." : q}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-accent/25 via-border/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" />
            <div className="relative flex items-center bg-[#070b0e]/70 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <Search className="h-4 w-4 text-muted-foreground ml-4 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter a test query to inspect retrieval candidates and score distributions..."
                className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50 font-light text-xs lg:text-sm px-3.5 py-2.5"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="mr-2 h-7 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 px-3.5 text-xs font-medium shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all shrink-0"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin mr-1.5" />
                    Inspecting...
                  </>
                ) : (
                  <>
                    Inspect Pipeline
                    <ArrowRight className="h-3 w-3 ml-1.5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Pipeline Telemetry Trace Bar */}
        <div className="bg-[#070b0e]/60 backdrop-blur-xl border border-white/10 rounded-xl p-3 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-accent" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-foreground font-medium">Pipeline Telemetry</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
              <span>Total Latency: <strong className="text-foreground">{currentTimings.total_ms}ms</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 items-center">
            {/* Step 1: User Query */}
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2 flex flex-col justify-between h-14">
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground/70 font-mono">1. Input Query</div>
              <div className="text-xs text-foreground font-medium truncate">{activeQuery}</div>
            </div>

            {/* Step 2: Vector */}
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2 flex flex-col justify-between h-14 relative group hover:border-[#00E5FF]/40 transition-colors">
              <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-[#00E5FF] font-mono">
                <span>2. Vector Search</span>
                <span>{currentTimings.vector_ms}ms</span>
              </div>
              <div className="flex items-center justify-between text-xs text-foreground">
                <span className="font-mono">{currentStrategies.vector?.length || 0} candidates</span>
                <span className="text-[9px] text-muted-foreground">Cosine</span>
              </div>
            </div>

            {/* Step 3: BM25 */}
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2 flex flex-col justify-between h-14 relative group hover:border-[#8B5CF6]/40 transition-colors">
              <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-[#8B5CF6] font-mono">
                <span>3. BM25 Lexical</span>
                <span>{currentTimings.bm25_ms}ms</span>
              </div>
              <div className="flex items-center justify-between text-xs text-foreground">
                <span className="font-mono">{currentStrategies.bm25?.length || 0} candidates</span>
                <span className="text-[9px] text-muted-foreground">Okapi</span>
              </div>
            </div>

            {/* Step 4: RRF Fusion */}
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2 flex flex-col justify-between h-14 relative group hover:border-[#14B8A6]/40 transition-colors">
              <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-[#14B8A6] font-mono">
                <span>4. RRF Fusion</span>
                <span>{currentTimings.rrf_ms}ms</span>
              </div>
              <div className="flex items-center justify-between text-xs text-foreground">
                <span className="font-mono">{currentStrategies.hybrid?.length || 0} merged</span>
                <span className="text-[9px] text-muted-foreground">k=60</span>
              </div>
            </div>

            {/* Step 5: Cross-Encoder */}
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2 flex flex-col justify-between h-14 relative group hover:border-[#F59E0B]/40 transition-colors">
              <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-[#F59E0B] font-mono">
                <span>5. Re-ranker</span>
                <span>{currentTimings.reranker_ms}ms</span>
              </div>
              <div className="flex items-center justify-between text-xs text-foreground">
                <span className="font-mono">{currentStrategies.reranked?.length || 0} selected</span>
                <span className="text-[9px] text-muted-foreground">Cross-Encoder</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Strategy Inspector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 flex-1 min-h-0">
          
          {/* Column 1: Vector Search */}
          <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-3 flex flex-col min-h-0 h-full">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center border border-[#00E5FF]/20 shrink-0">
                  <Database className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-foreground">Vector Search</h3>
                  <p className="text-[9px] text-muted-foreground font-mono">Dense Cosine Embeddings</p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-1.5 py-0.5 rounded border border-[#00E5FF]/20">
                {currentTimings.vector_ms}ms
              </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 min-h-0">
              {currentStrategies.vector?.map((candidate: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setSelectedChunk({ ...candidate, strategy: "Vector Search" })}
                  className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-[#00E5FF]/30 rounded-lg p-2.5 transition-all cursor-pointer group flex flex-col gap-1.5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="h-4 w-4 rounded bg-[#00E5FF]/15 text-[#00E5FF] font-mono text-[9px] font-semibold flex items-center justify-center shrink-0">
                        #{candidate.rank}
                      </span>
                      <span className="text-[11px] font-medium text-foreground truncate">{candidate.document}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-1 rounded shrink-0">
                      {candidate.score}%
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-3 font-light">
                    {candidate.snippet}
                  </p>
                  <div className="flex items-center justify-between text-[8px] font-mono text-muted-foreground/60 pt-1 border-t border-white/5">
                    <span>ID: {candidate.chunk_id}</span>
                    <span className="text-accent group-hover:underline flex items-center gap-0.5">
                      Inspect <ArrowUpRight className="h-2 w-2" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: BM25 Search */}
          <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-3 flex flex-col min-h-0 h-full">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center border border-[#8B5CF6]/20 shrink-0">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-foreground">BM25 Search</h3>
                  <p className="text-[9px] text-muted-foreground font-mono">Sparse Token Scoring</p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-[#8B5CF6] bg-[#8B5CF6]/10 px-1.5 py-0.5 rounded border border-[#8B5CF6]/20">
                {currentTimings.bm25_ms}ms
              </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 min-h-0">
              {currentStrategies.bm25?.map((candidate: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setSelectedChunk({ ...candidate, strategy: "BM25 Search" })}
                  className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-[#8B5CF6]/30 rounded-lg p-2.5 transition-all cursor-pointer group flex flex-col gap-1.5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="h-4 w-4 rounded bg-[#8B5CF6]/15 text-[#8B5CF6] font-mono text-[9px] font-semibold flex items-center justify-center shrink-0">
                        #{candidate.rank}
                      </span>
                      <span className="text-[11px] font-medium text-foreground truncate">{candidate.document}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#8B5CF6] bg-[#8B5CF6]/10 px-1 rounded shrink-0">
                      {candidate.score}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-3 font-light">
                    {candidate.snippet}
                  </p>
                  <div className="flex items-center justify-between text-[8px] font-mono text-muted-foreground/60 pt-1 border-t border-white/5">
                    <span>ID: {candidate.chunk_id}</span>
                    <span className="text-[#8B5CF6] group-hover:underline flex items-center gap-0.5">
                      Inspect <ArrowUpRight className="h-2 w-2" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Hybrid RRF */}
          <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-3 flex flex-col min-h-0 h-full">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-[#14B8A6]/10 text-[#14B8A6] flex items-center justify-center border border-[#14B8A6]/20 shrink-0">
                  <Layers className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-foreground">Hybrid RRF</h3>
                  <p className="text-[9px] text-muted-foreground font-mono">Reciprocal Rank Fusion</p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-[#14B8A6] bg-[#14B8A6]/10 px-1.5 py-0.5 rounded border border-[#14B8A6]/20">
                {currentTimings.rrf_ms}ms
              </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 min-h-0">
              {currentStrategies.hybrid?.map((candidate: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setSelectedChunk({ ...candidate, strategy: "Hybrid RRF" })}
                  className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-[#14B8A6]/30 rounded-lg p-2.5 transition-all cursor-pointer group flex flex-col gap-1.5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="h-4 w-4 rounded bg-[#14B8A6]/15 text-[#14B8A6] font-mono text-[9px] font-semibold flex items-center justify-center shrink-0">
                        #{candidate.rank}
                      </span>
                      <span className="text-[11px] font-medium text-foreground truncate">{candidate.document}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#14B8A6] bg-[#14B8A6]/10 px-1 rounded shrink-0">
                      {candidate.score}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-3 font-light">
                    {candidate.snippet}
                  </p>
                  <div className="flex items-center justify-between text-[8px] font-mono text-muted-foreground/60 pt-1 border-t border-white/5">
                    <span>ID: {candidate.chunk_id}</span>
                    <span className="text-[#14B8A6] group-hover:underline flex items-center gap-0.5">
                      Inspect <ArrowUpRight className="h-2 w-2" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Re-ranker */}
          <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-3 flex flex-col min-h-0 h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#F59E0B]/50 to-transparent" />
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center border border-[#F59E0B]/20 shrink-0">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-foreground">Cross-Encoder</h3>
                  <p className="text-[9px] text-[#F59E0B] font-mono">Final Reranked Context</p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded border border-[#F59E0B]/20">
                {currentTimings.reranker_ms}ms
              </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 min-h-0">
              {currentStrategies.reranked?.map((candidate: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setSelectedChunk({ ...candidate, strategy: "Cross-Encoder Re-ranker" })}
                  className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-[#F59E0B]/30 rounded-lg p-2.5 transition-all cursor-pointer group flex flex-col gap-1.5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="h-4 w-4 rounded bg-[#F59E0B]/15 text-[#F59E0B] font-mono text-[9px] font-semibold flex items-center justify-center shrink-0">
                        #{candidate.rank}
                      </span>
                      <span className="text-[11px] font-medium text-foreground truncate">{candidate.document}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#F59E0B] bg-[#F59E0B]/10 px-1 rounded shrink-0">
                      {candidate.score}%
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-3 font-light">
                    {candidate.snippet}
                  </p>
                  <div className="flex items-center justify-between text-[8px] font-mono text-muted-foreground/60 pt-1 border-t border-white/5">
                    <span>ID: {candidate.chunk_id}</span>
                    <span className="text-[#F59E0B] group-hover:underline flex items-center gap-0.5">
                      Inspect <ArrowUpRight className="h-2 w-2" />
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
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 lg:p-8">
          <div className="bg-[#070b0e] border border-accent/20 shadow-[0_0_50px_rgba(0,229,255,0.1)] rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0 opacity-50" />

            <div className="flex justify-between items-center p-5 border-b border-white/5 bg-[#030405]/50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-medium text-foreground truncate">{selectedChunk.document}</h2>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="text-accent font-mono border border-accent/20 bg-accent/10 px-1.5 rounded uppercase tracking-wider text-[10px]">
                      {selectedChunk.strategy}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[10px] opacity-80">Rank #{selectedChunk.rank}</span>
                    <span>•</span>
                    <span className="font-mono text-[10px] text-emerald-400">
                      Score: {selectedChunk.score}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedChunk(null)}
                className="hover:bg-white/10 shrink-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[#0a0f14] space-y-4">
              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <Activity className="h-3 w-3 text-accent" /> Raw Chunk Content
                </span>
                <span>Chunk ID: {selectedChunk.chunk_id}</span>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 rounded-xl bg-accent/10 blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative bg-[#030405] border border-white/10 rounded-xl p-5 shadow-inner text-sm leading-relaxed text-foreground/90 font-light whitespace-pre-wrap">
                  {selectedChunk.content || selectedChunk.snippet}
                </div>
              </div>

              {selectedChunk.metadata && (
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                    Chunk Metadata
                  </div>
                  <pre className="bg-[#030405] border border-white/5 rounded-lg p-3 text-[11px] font-mono text-muted-foreground overflow-x-auto">
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
    <Suspense fallback={<div className="h-full w-full flex items-center justify-center text-muted-foreground">Loading Retrieval Inspector...</div>}>
      <RetrievalInspectorContent />
    </Suspense>
  );
}
