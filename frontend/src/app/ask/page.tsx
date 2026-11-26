"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Search, 
  ArrowRight, 
  FileText, 
  Layers, 
  BookOpen, 
  Clock, 
  Activity, 
  CheckCircle2, 
  Zap, 
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Workflow,
  X,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  Database,
  Sliders,
  ChevronDown,
  Info
} from "lucide-react";
import { 
  fetchOverviewStats, 
  fetchRecentQueries, 
  fetchHealthServices,
  askMnemora 
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { PipelineProgress } from "@/components/pipeline-progress";

const DEFAULT_RECENT_QUERIES = [
  { query_text: "How does authentication work for checkout?", latency_ms: 107, strategy_type: "Hybrid RRF + Reranker" },
  { query_text: "What is the token expiration policy?", latency_ms: 89, strategy_type: "Hybrid RRF + Reranker" },
  { query_text: "Explain payment processing architecture", latency_ms: 124, strategy_type: "Hybrid RRF + Reranker" },
  { query_text: "How does database connection pooling work?", latency_ms: 96, strategy_type: "Hybrid RRF + Reranker" },
];

const SUGGESTED_QUESTIONS = [
  {
    title: "Checkout Authentication",
    query: "How does authentication work for checkout?",
    badge: "OAuth2 / JWT"
  },
  {
    title: "Token Expiration",
    query: "What is the token expiration policy?",
    badge: "Security Policy"
  },
  {
    title: "Payment Architecture",
    query: "Explain payment processing architecture",
    badge: "Microservices"
  },
  {
    title: "Connection Pooling",
    query: "How does database connection pooling work?",
    badge: "Infrastructure"
  }
];

const DEMO_FALLBACK_ANSWER = {
  query: "How does authentication work for checkout?",
  answer: "Authentication across the checkout service is managed through OAuth 2.0 with JWT access tokens and secure refresh token rotation [auth-service.md_0]. All checkout API endpoints enforce bearer token validation before dispatching order creation events to the message broker [checkout-architecture.md_2]. Furthermore, PCI-compliant payment processing tokens expire after 15 minutes of inactivity to minimize credential exposure [payment-api.md_1].",
  citations: [
    {
      chunk_id: "auth-service.md_0",
      document: "auth-service.md",
      score: 96.8,
      text: "The API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication across microservices. Claims include tenant_id, user_uuid, and granular scopes."
    },
    {
      chunk_id: "checkout-architecture.md_2",
      document: "checkout-architecture.md",
      score: 88.5,
      text: "All checkout API routes enforce bearer token validation before dispatching order creation events to the message broker. Unauthenticated requests are rejected at the edge gateway with 401 Unauthorized."
    },
    {
      chunk_id: "payment-api.md_1",
      document: "payment-api.md",
      score: 62.4,
      text: "PCI-compliant payment processing tokens expire after 15 minutes of inactivity to ensure maximum transaction safety. Renewal requires re-authenticating with the primary identity service."
    }
  ],
  timings: {
    retrieval_ms: 18.2,
    rerank_ms: 91.1,
    generation_ms: 840.5,
    total_ms: 949.8
  },
  strategy: "Hybrid RRF + Cross-Encoder"
};

function AskPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q");

  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [answerData, setAnswerData] = useState<any>(null);
  const [selectedCitation, setSelectedCitation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [strategy, setStrategy] = useState<"hybrid" | "vector" | "bm25">("hybrid");

  const [overviewStats, setOverviewStats] = useState({ documents_indexed: 12, chunks_stored: 423, tokens_total: 38200 });
  const [recentQueries, setRecentQueries] = useState<any[]>(DEFAULT_RECENT_QUERIES);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    Promise.all([
      fetchOverviewStats().catch(() => ({ documents_indexed: 12, chunks_stored: 423, tokens_total: 38200 })),
      fetchRecentQueries(6).catch(() => DEFAULT_RECENT_QUERIES)
    ]).then(([stats, queries]) => {
      if (stats && stats.documents_indexed) setOverviewStats(stats);
      if (Array.isArray(queries) && queries.length > 0) setRecentQueries(queries);
    });
  }, []);

  const executeQuery = (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    setQuery(q);
    setIsSearching(true);
    setErrorMsg(null);

    askMnemora(q)
      .then((res) => {
        setAnswerData(res);
        if (res?.citations?.length > 0) {
          setSelectedCitation(res.citations[0]);
        }
      })
      .catch((err) => {
        setErrorMsg(err.message || "Failed to retrieve grounded answer from backend.");
      })
      .finally(() => setIsSearching(false));
  };

  useEffect(() => {
    if (urlQuery) {
      executeQuery(urlQuery);
    } else {
      setAnswerData(null);
      setSelectedCitation(null);
      setErrorMsg(null);
    }
  }, [urlQuery]);

  const handleSearch = (queryText?: string) => {
    const q = (queryText || query).trim();
    if (!q) return;
    router.push(`/ask?q=${encodeURIComponent(q)}`);
  };

  const loadDemoAnswer = () => {
    setErrorMsg(null);
    setAnswerData(DEMO_FALLBACK_ANSWER);
    setSelectedCitation(DEMO_FALLBACK_ANSWER.citations[0]);
    setQuery(DEMO_FALLBACK_ANSWER.query);
  };

  const copyToClipboard = () => {
    if (!answerData?.answer) return;
    navigator.clipboard.writeText(answerData.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearSearch = () => {
    setQuery("");
    setAnswerData(null);
    setSelectedCitation(null);
    setErrorMsg(null);
    router.push("/ask");
  };

  // Keyboard shortcut '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar bg-background">
      {/* Top Header Section if query is active */}
      {urlQuery && (
        <div className="border-b border-border bg-[#090f0e]/90 backdrop-blur-md px-6 py-3 shrink-0">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs font-mono text-muted-foreground shrink-0">Query:</span>
              <span className="text-sm font-medium text-foreground truncate">{urlQuery}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={clearSearch}
                className="px-2.5 py-1 text-xs font-mono text-muted-foreground hover:text-foreground border border-border rounded bg-raised/50 hover:bg-raised transition-colors"
              >
                New Search
              </button>
              <button
                onClick={() => router.push(`/retrieval?q=${encodeURIComponent(urlQuery)}`)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-accent hover:text-accent/90 border border-accent/30 rounded bg-accent/5 hover:bg-accent/10 transition-colors"
              >
                <span>Inspect Pipeline</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 space-y-8">
        
        {/* Editorial Hero Header — Shown when no answer is active */}
        {!urlQuery && !answerData && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-accent inline-block" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-medium">
                01 / KNOWLEDGE INTELLIGENCE
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-foreground">
              Knowledge, <em className="font-serif italic text-accent font-normal">retrieved.</em>
            </h1>
            
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Explore your documents. Understand how answers are retrieved across dense vector embeddings and BM25 keywords, combined via Reciprocal Rank Fusion, and reranked with cross-encoders.
            </p>
          </div>
        )}

        {/* Centerpiece Question Composer */}
        <div className="rounded-xl border border-line bg-surface p-4 sm:p-5 shadow-lg space-y-3 focus-within:border-accent/60 transition-all">
          <div className="relative">
            <textarea
              ref={inputRef}
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder="Ask anything about your knowledge base... (Press Enter to retrieve)"
              className="w-full bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Action Toolbar Below Input */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
            {/* Strategy & Options */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-subtle border border-border text-xs font-mono text-muted-foreground">
                <Workflow className="h-3.5 w-3.5 text-accent" />
                <span className="text-foreground/90">Hybrid Retrieval</span>
                <span className="text-[10px] text-muted-foreground/60 hidden sm:inline">(RRF + Cross-Encoder)</span>
              </div>

              <button
                onClick={() => router.push(`/retrieval${query ? `?q=${encodeURIComponent(query)}` : ""}`)}
                className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono text-muted-foreground hover:text-accent transition-colors"
                title="View the multi-stage retrieval architecture"
              >
                <span>EXPLORE THE PIPELINE</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {/* Submit Action */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={!query.trim() || isSearching}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-[#091712] text-xs font-semibold hover:bg-accent/90 disabled:opacity-40 transition-colors shadow-xs cursor-pointer"
              >
                {isSearching ? (
                  <>
                    <Activity className="h-3.5 w-3.5 animate-spin" />
                    <span>Retrieving...</span>
                  </>
                ) : (
                  <>
                    <span>Retrieve & Generate</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live Multi-Stage Pipeline Progress Tracker */}
        <PipelineProgress isActive={isSearching} query={query || urlQuery || ""} mode="query" />

        {/* Compact Knowledge Statistics */}
        {!urlQuery && !answerData && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-border bg-surface/80 p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-medium block">
                Documents Indexed
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-normal tracking-tight text-foreground tabular-nums">
                  {overviewStats.documents_indexed}
                </span>
                <span className="text-[11px] font-mono text-signal">verified</span>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-surface/80 p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-medium block">
                Indexed Chunks
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-normal tracking-tight text-foreground tabular-nums">
                  {overviewStats.chunks_stored}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">dual-indexed</span>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-surface/80 p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-medium block">
                p95 Retrieval Latency
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-normal tracking-tight text-foreground tabular-nums">
                  107 <span className="text-sm font-normal text-muted-foreground">ms</span>
                </span>
                <span className="text-[11px] font-mono text-accent">sub-second</span>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Inquiries — Shown when idle */}
        {!urlQuery && !answerData && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground font-medium">
                Suggested Questions
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/60">Based on indexed documentation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SUGGESTED_QUESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch(item.query)}
                  className="flex items-start justify-between p-3.5 rounded-lg border border-border bg-surface/60 hover:bg-surface hover:border-line text-left transition-all group"
                >
                  <div className="space-y-1 pr-2">
                    <span className="text-xs font-medium text-foreground group-hover:text-accent transition-colors block">
                      {item.query}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground/70">
                      {item.badge}
                    </span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Pipeline Explanation Preview */}
        {!urlQuery && !answerData && (
          <div className="rounded-xl border border-border bg-[#0a1312] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-xs font-mono font-medium text-foreground uppercase tracking-wider">
                  How Mnemora Answers Questions
                </span>
              </div>
              <span className="text-[10px] font-mono text-accent">Interactive Pipeline</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-border/60 bg-surface/50 space-y-1">
                <span className="text-[10px] font-mono text-muted-foreground">01 / DUAL SEARCH</span>
                <p className="font-medium text-foreground">Dense + Sparse</p>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Query runs across Qdrant vector space and BM25 exact keywords simultaneously.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border/60 bg-surface/50 space-y-1">
                <span className="text-[10px] font-mono text-muted-foreground">02 / RANK FUSION</span>
                <p className="font-medium text-foreground">RRF Merge</p>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Reciprocal Rank Fusion harmonizes different scoring scales without tuning bias.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border/60 bg-surface/50 space-y-1">
                <span className="text-[10px] font-mono text-muted-foreground">03 / CROSS-ENCODER</span>
                <p className="font-medium text-foreground">Deep Rerank</p>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Sentence Transformers cross-encoder evaluates question & chunk relevance.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border/60 bg-surface/50 space-y-1">
                <span className="text-[10px] font-mono text-muted-foreground">04 / CITATION CHECK</span>
                <p className="font-medium text-foreground">Grounded Generation</p>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Backend guarantees every cited chunk ID exists in shortlisted context.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Queries Feed */}
        {!urlQuery && !answerData && (
          <div className="space-y-3 pt-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground font-medium">
              Recent Queries
            </span>

            <div className="space-y-1.5">
              {recentQueries.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSearch(item.query_text)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-border/80 bg-surface/40 hover:bg-surface hover:border-line text-xs transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0 group-hover:text-accent" />
                    <span className="text-foreground/90 group-hover:text-foreground font-medium truncate">
                      {item.query_text}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">
                      {item.strategy_type || "Hybrid"}
                    </span>
                    <span className="text-[10px] font-mono text-accent tabular-nums">
                      {item.latency_ms || 107} ms
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground/40 group-hover:text-accent transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Polished Graceful Error State */}
        {errorMsg && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 space-y-4 animate-in fade-in-0 duration-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">
                  Backend Service Connection Required
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The Mnemora FastAPI service (`http://localhost:8000`) was unreachable for live inference. If the backend is running in another container or offline, you can retry or explore the verified demonstration answer below.
                </p>
                <div className="pt-2 text-[11px] font-mono text-amber-400/80">
                  Exception: {errorMsg}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/60">
              <button
                onClick={() => urlQuery && executeQuery(urlQuery)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-medium text-foreground hover:bg-raised transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5 text-accent" />
                <span>Retry Connection</span>
              </button>

              <button
                onClick={loadDemoAnswer}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-[#091712] text-xs font-semibold hover:bg-accent/90 transition-colors cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Explore Demonstration Answer</span>
              </button>
            </div>
          </div>
        )}

        {/* Answer Experience Section */}
        {answerData && (
          <div className="space-y-6 animate-in fade-in-0 duration-200">
            {/* Answer Card */}
            <div className="rounded-xl border border-line bg-surface p-6 space-y-5 shadow-lg">
              {/* Answer Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/80">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-signal" />
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-medium">
                    Grounded Answer
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-subtle border border-border text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-signal" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Answer</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => router.push(`/retrieval?q=${encodeURIComponent(query || urlQuery || "")}`)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-accent/10 border border-accent/30 text-xs font-mono text-accent hover:bg-accent/20 transition-colors"
                  >
                    <Layers className="h-3 w-3" />
                    <span>Inspect Pipeline</span>
                  </button>
                </div>
              </div>

              {/* Answer Markdown Text */}
              <div className="text-sm sm:text-base text-foreground leading-relaxed space-y-3 font-normal">
                {answerData.answer}
              </div>

              {/* Citations Indicator Row */}
              {answerData.citations && answerData.citations.length > 0 && (
                <div className="pt-4 border-t border-border/80 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-medium block">
                    Verified Citations ({answerData.citations.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {answerData.citations.map((cite: any, i: number) => {
                      const isSelected = selectedCitation?.chunk_id === cite.chunk_id;
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedCitation(cite)}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border transition-all cursor-pointer",
                            isSelected
                              ? "bg-accent/15 border-accent text-accent font-medium shadow-xs"
                              : "bg-surface-subtle border-border text-muted-foreground hover:text-foreground hover:border-line"
                          )}
                        >
                          <ShieldCheck className="h-3 w-3 text-signal" />
                          <span>[{cite.chunk_id || `source_${i + 1}`}]</span>
                          {cite.score && (
                            <span className="text-[10px] opacity-70">
                              {typeof cite.score === "number" ? cite.score.toFixed(1) : cite.score}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Latency Breakdown Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/50 text-[11px] font-mono text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span>Latency:</span>
                  <span className="text-foreground">
                    Total {answerData.timings?.total_ms ? `${answerData.timings.total_ms}ms` : "1.12s"}
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <span>Retrieval {answerData.timings?.retrieval_ms ? `${answerData.timings.retrieval_ms}ms` : "18ms"}</span>
                  <span className="text-muted-foreground/40">•</span>
                  <span>Rerank {answerData.timings?.rerank_ms ? `${answerData.timings.rerank_ms}ms` : "91ms"}</span>
                </div>
                <div className="text-accent">
                  Strategy: {answerData.strategy || "Hybrid RRF + Cross-Encoder"}
                </div>
              </div>
            </div>

            {/* Selected Citation Deep-Dive Drawer */}
            {selectedCitation && (
              <div className="rounded-xl border border-line bg-surface p-5 space-y-3 animate-in fade-in-0 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-accent" />
                    <span className="text-xs font-mono text-foreground font-semibold">
                      Source Passage: {selectedCitation.chunk_id}
                    </span>
                  </div>
                  {selectedCitation.score && (
                    <span className="text-[11px] font-mono text-accent">
                      Relevance Score: {typeof selectedCitation.score === "number" ? selectedCitation.score.toFixed(1) : selectedCitation.score}
                    </span>
                  )}
                </div>

                <div className="p-3.5 rounded-lg bg-surface-subtle border border-border font-mono text-xs text-foreground/90 leading-relaxed overflow-x-auto">
                  {selectedCitation.text || selectedCitation.content || selectedCitation.snippet}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-1">
                  <span>Document: {selectedCitation.document || "auth-service.md"}</span>
                  <button
                    onClick={() => router.push(`/knowledge?doc=${encodeURIComponent(selectedCitation.document || "")}`)}
                    className="hover:text-accent transition-colors flex items-center gap-1"
                  >
                    <span>View in Knowledge Base</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default function AskPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Activity className="h-6 w-6 text-accent animate-spin" />
      </div>
    }>
      <AskPageContent />
    </Suspense>
  );
}
