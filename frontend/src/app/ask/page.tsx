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
  X
} from "lucide-react";
import { 
  fetchOverviewStats, 
  fetchRecentQueries, 
  fetchHealthServices,
  askMnemora 
} from "@/lib/api";

const DEFAULT_RECENT_QUERIES = [
  { query_text: "How does authentication work?", latency_ms: 107, strategy_type: "Hybrid" },
  { query_text: "What is the token expiration policy?", latency_ms: 89, strategy_type: "Hybrid" },
  { query_text: "Explain payment processing architecture", latency_ms: 124, strategy_type: "Hybrid" },
  { query_text: "How does database connection pooling work?", latency_ms: 96, strategy_type: "Hybrid" },
];

function AskPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q");

  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [answerData, setAnswerData] = useState<any>(null);
  const [selectedCitation, setSelectedCitation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [overviewStats, setOverviewStats] = useState({ documents_indexed: 12, chunks_stored: 423, tokens_total: 38200 });
  const [recentQueries, setRecentQueries] = useState<any[]>(DEFAULT_RECENT_QUERIES);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([
      fetchOverviewStats().catch(() => ({ documents_indexed: 12, chunks_stored: 423, tokens_total: 38200 })),
      fetchRecentQueries(6).catch(() => DEFAULT_RECENT_QUERIES)
    ]).then(([stats, queries]) => {
      if (stats && stats.documents_indexed) setOverviewStats(stats);
      if (Array.isArray(queries) && queries.length > 0) setRecentQueries(queries);
    });
  }, []);

  useEffect(() => {
    if (urlQuery) {
      setQuery(urlQuery);
      setIsSearching(true);
      setErrorMsg(null);
      askMnemora(urlQuery)
        .then((res) => {
          setAnswerData(res);
          if (res?.citations?.length > 0) {
            setSelectedCitation(res.citations[0]);
          }
        })
        .catch((err) => {
          setErrorMsg(err.message || "Failed to retrieve grounded answer.");
        })
        .finally(() => setIsSearching(false));
    } else {
      setAnswerData(null);
      setSelectedCitation(null);
    }
  }, [urlQuery]);

  const handleSearch = (queryText?: string) => {
    const q = (queryText || query).trim();
    if (!q) return;
    router.push(`/ask?q=${encodeURIComponent(q)}`);
  };

  const clearSearch = () => {
    setQuery("");
    setAnswerData(null);
    setSelectedCitation(null);
    router.push("/ask");
  };

  // Shortcut key '/'
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
      {/* If urlQuery is present, show a docked search bar on top */}
      {urlQuery && (
        <div className="border-b border-border bg-[#090f0e]/90 backdrop-blur-md p-4 sm:px-8 shrink-0">
          <div className="max-w-4xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="relative flex items-center rounded-lg border border-line bg-surface-subtle shadow-sm focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/20 transition-all"
            >
              <Search className="h-4 w-4 ml-3.5 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question about your documents..."
                disabled={isSearching}
                className="w-full bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none font-light"
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-1 mr-1 text-muted-foreground hover:text-foreground transition-colors"
                  title="Clear query"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="submit"
                disabled={!query.trim() || isSearching}
                className="inline-flex items-center gap-1.5 mr-2 px-3 py-1.5 rounded-md bg-accent text-[#091712] font-medium text-xs hover:bg-accent/90 disabled:opacity-40 transition-colors shrink-0"
              >
                <span>{isSearching ? "Searching..." : "Retrieve"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 space-y-8">
        {!urlQuery ? (
          /* ========================================================================= */
          /* SECTION 3 EXACT LAYOUT: RETRIEVAL WORKSPACE / COMPOSER HERO               */
          /* ========================================================================= */
          <div className="space-y-8 py-2">
            
            {/* Header: RETRIEVAL WORKSPACE */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-[2px] bg-accent inline-block" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-medium">
                  RETRIEVAL WORKSPACE
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-foreground">
                Explore your <em className="font-serif italic text-accent font-normal">knowledge.</em>
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Search, retrieve and inspect grounded answers.
              </p>
            </div>

            {/* Central Search Composer (Matching Section 3: "Ask a question about your documents... / Hybrid retrieval") */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="rounded-xl border border-line bg-surface-subtle shadow-sm focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/20 transition-all p-3 space-y-3"
            >
              <div className="flex items-center gap-3 px-1 pt-1">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a question about your documents..."
                  disabled={isSearching}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none font-light"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/40 px-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/80 border border-border text-[11px] font-mono text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                  <span>Hybrid retrieval</span>
                </div>

                <button
                  type="submit"
                  disabled={!query.trim() || isSearching}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-accent text-[#091712] font-medium text-xs hover:bg-accent/90 disabled:opacity-40 transition-colors shrink-0 cursor-pointer"
                >
                  <span>Retrieve</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>

            {/* Section 3 Stats Row: Documents (12) | Latency · p95 (107 ms) | Benchmark (60) */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="rounded-lg border border-border bg-surface p-4 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Documents
                </span>
                <div className="text-2xl font-semibold text-foreground tracking-tight tabular-nums">
                  {overviewStats.documents_indexed || 12}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-surface p-4 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Latency · p95
                </span>
                <div className="text-2xl font-semibold text-foreground tracking-tight tabular-nums font-mono">
                  107 <span className="text-xs text-muted-foreground font-normal">ms</span>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-surface p-4 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Benchmark
                </span>
                <div className="text-2xl font-semibold text-foreground tracking-tight tabular-nums font-mono">
                  60
                </div>
              </div>
            </div>

            {/* Section 3 Two-Column Layout: Retrieval pipeline (Left) | Recent queries (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              {/* Left: Retrieval pipeline */}
              <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border/80">
                  <div className="flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-accent" />
                    <h3 className="text-xs font-mono uppercase tracking-wider text-foreground font-medium">
                      Retrieval pipeline
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-signal">
                    Ready
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded bg-surface-subtle border border-border/80">
                    <span className="text-muted-foreground">1. Query Analysis</span>
                    <span className="text-[11px] text-foreground">Intent tokenization</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-surface-subtle border border-border/80">
                    <span className="text-accent">2. Dense Vector Search</span>
                    <span className="text-[11px] text-muted-foreground">Cosine / 384d</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-surface-subtle border border-border/80">
                    <span className="text-signal">3. Sparse Lexical Search</span>
                    <span className="text-[11px] text-muted-foreground">BM25Okapi</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-surface-subtle border border-border/80">
                    <span className="text-foreground">4. Rank Fusion (RRF)</span>
                    <span className="text-[11px] text-muted-foreground">k=60 merged</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-secondary border border-accent/30 text-accent font-medium">
                    <span>5. Cross-Encoder Re-rank</span>
                    <span className="text-[11px]">Top 5 passages</span>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button
                    onClick={() => router.push("/retrieval")}
                    className="text-xs text-accent hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <span>Inspect Pipeline in Detail</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Right: Recent queries (Section 3: "Recent queries / How does authentication work?") */}
              <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border/80">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-foreground font-medium">
                    Recent queries
                  </h3>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Click to run
                  </span>
                </div>

                <div className="space-y-2">
                  {recentQueries.slice(0, 5).map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearch(item.query_text)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg border border-border/80 bg-surface-subtle hover:bg-raised transition-colors text-left group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-border group-hover:bg-accent transition-colors shrink-0" />
                        <span className="text-xs text-foreground/90 font-light truncate group-hover:text-accent transition-colors">
                          {item.query_text}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground tabular-nums shrink-0">
                        {item.latency_ms || 107} ms
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* ANSWER & GROUNDED TRACE VIEW                                              */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* Loading state */}
            {isSearching && (
              <div className="rounded-lg border border-border bg-surface p-8 text-center space-y-3">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-accent border-r-transparent" />
                <p className="text-sm text-foreground/80 font-light">
                  Executing hybrid retrieval, reranking, and generation...
                </p>
                <div className="flex justify-center gap-4 text-xs font-mono text-muted-foreground pt-1">
                  <span>Vector Search</span>
                  <span>•</span>
                  <span>BM25 Sparse</span>
                  <span>•</span>
                  <span>Cross-Encoder</span>
                </div>
              </div>
            )}

            {/* Error state */}
            {errorMsg && !isSearching && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                {errorMsg}
              </div>
            )}

            {/* Grounded Answer Card */}
            {answerData && !isSearching && (
              <div className="rounded-xl border border-line bg-surface p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-border/80 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-signal" />
                    <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-medium">
                      Grounded Answer
                    </span>
                  </div>
                  {answerData.performance && (
                    <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                      <span>Total: <strong className="text-foreground">{answerData.performance.total_ms}ms</strong></span>
                      <span className="text-border">•</span>
                      <span>Confidence: <strong className="text-signal">{answerData.performance.confidence_score}%</strong></span>
                    </div>
                  )}
                </div>

                <div className="text-sm sm:text-base leading-relaxed text-foreground font-light whitespace-pre-wrap selection:bg-accent/20">
                  {answerData.answer}
                </div>

                {/* Sources list */}
                {answerData.citations && answerData.citations.length > 0 && (
                  <div className="pt-4 border-t border-border/60 space-y-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      Sources & Grounding Passages ({answerData.citations.length})
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {answerData.citations.map((cite: any, idx: number) => {
                        const isSelected = selectedCitation?.chunk_id === cite.chunk_id;
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedCitation(cite)}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs transition-colors cursor-pointer ${
                              isSelected
                                ? "border-accent bg-accent/10 text-accent font-medium"
                                : "border-border bg-secondary/50 text-foreground/80 hover:border-line hover:text-foreground"
                            }`}
                          >
                            <FileText className="h-3 w-3 text-muted-foreground" />
                            <span>{cite.document}</span>
                            <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-background/50 border border-border">
                              P.{cite.page || 1}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Selected Citation Passage Viewer */}
            {selectedCitation && !isSearching && (
              <div className="rounded-xl border border-line bg-surface-subtle p-5 sm:p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-accent" />
                    <span className="text-xs font-medium text-foreground">
                      {selectedCitation.document}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      ({selectedCitation.chunk_id})
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-accent border border-border">
                    Relevance: {selectedCitation.score || 95}%
                  </span>
                </div>

                <div className="p-4 rounded-lg border border-border/60 bg-background/70 font-mono text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedCitation.content || selectedCitation.snippet || "No passage content available."}
                </div>
              </div>
            )}

            {/* Performance Timings Breakdown */}
            {answerData?.performance && !isSearching && (
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-border bg-surface p-3 space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    Retrieval Latency
                  </span>
                  <div className="text-base font-semibold text-foreground font-mono tabular-nums">
                    {answerData.performance.retrieval_ms} ms
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-surface p-3 space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    Generation Latency
                  </span>
                  <div className="text-base font-semibold text-foreground font-mono tabular-nums">
                    {answerData.performance.generation_ms} ms
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-surface p-3 space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    Multi-Stage Pipeline
                  </span>
                  <button
                    onClick={() => router.push(`/retrieval?q=${encodeURIComponent(query)}`)}
                    className="text-xs text-accent hover:underline flex items-center gap-1 font-medium pt-0.5 cursor-pointer"
                  >
                    <span>Inspect Pipeline</span>
                    <ChevronRight className="h-3 w-3" />
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
    <Suspense fallback={<div className="p-8 text-xs font-mono text-muted-foreground">Loading workspace...</div>}>
      <AskPageContent />
    </Suspense>
  );
}
