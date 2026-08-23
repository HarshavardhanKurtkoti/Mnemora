"use client";

import { useState } from "react";
import { ArrowRight, FileText, ChevronDown, ChevronRight, Activity, Search, Command, BookOpen, Layers, Fingerprint, Clock, CheckCircle2, File, Zap, Database, Server, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const performanceData = [
  { name: "Vector Search", recall: 51.7, color: "#00E5FF" },
  { name: "BM25", recall: 42.7, color: "#8B5CF6" },
  { name: "Hybrid RRF", recall: 48.7, color: "#14B8A6" },
  { name: "Hybrid + Reranker", recall: 49.0, color: "#F59E0B" },
];

export default function AskPage() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResult, setShowResult] = useState(false); 

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setIsSearching(true);
    // Simulate search
    setTimeout(() => {
      setIsSearching(false);
      setShowResult(true);
    }, 1500);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {!showResult ? (
        // DASHBOARD VIEW (Empty State)
        <div className="relative flex-1 w-full text-foreground p-4 lg:p-5 overflow-hidden flex flex-col">
          {/* Subtle Ambient Background */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00E5FF]/5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#8B5CF6]/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="max-w-[1600px] w-full flex-1 min-h-0 mx-auto flex flex-col gap-3 lg:gap-4">
            
            {/* Top Row: Hero/Stats (Left) & System Status (Right) */}
            <div className="flex gap-2 lg:gap-4 min-h-0">
              {/* Left Side: Hero, Search, and Stats */}
              <div className="flex-1 flex flex-col gap-1.5 lg:gap-2 min-h-0 justify-center">
                
                {/* Hero & Search */}
                <div className="space-y-1">
                  <div>
                    <h1 className="text-lg lg:text-2xl font-light tracking-wide text-foreground">
                      Ask your <span className="font-serif italic text-accent opacity-90">knowledge.</span>
                    </h1>
                    <p className="text-muted-foreground text-[9px] lg:text-xs mt-0.5 max-w-xl leading-relaxed">
                      Search across your indexed knowledge using semantic retrieval, keyword search, hybrid fusion and reranking.
                    </p>
                  </div>

                  <div className="relative group max-w-3xl">
                    <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-accent/20 via-border/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm"></div>
                    
                    <form onSubmit={handleSearch} className="relative bg-[#070b0e]/50 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                      <div className="flex items-center px-3 lg:px-4 py-1 lg:py-1.5 border-b border-white/5">
                        <input 
                          type="text" 
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Ask anything about your knowledge..."
                          className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50 font-light text-xs lg:text-sm"
                          disabled={isSearching}
                        />
                        <button 
                          type="submit"
                          disabled={!query || isSearching}
                          className="flex items-center justify-center h-5 w-5 lg:h-6 lg:w-6 rounded bg-transparent border border-accent/30 text-accent hover:bg-accent hover:text-black transition-colors shrink-0"
                        >
                          <ArrowUpRight className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between px-3 lg:px-4 py-0.5 lg:py-1 bg-white/[0.01]">
                        <div className="flex items-center gap-3 lg:gap-6">
                          <div className="flex items-center gap-1.5 text-[9px] lg:text-[10px] text-muted-foreground cursor-pointer hover:text-foreground">
                            <Command className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                            <span>HYBRID RRF <ChevronDown className="h-2.5 w-2.5 inline" /></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[9px] lg:text-[10px] text-muted-foreground cursor-pointer hover:text-foreground">
                            <FileText className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                            <span>12 DOCUMENTS</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[9px] lg:text-[10px] text-muted-foreground cursor-pointer hover:text-foreground">
                            <Zap className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                            <span>LOCAL</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[8px] lg:text-[9px] text-muted-foreground font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/5 shrink-0">
                          <Command className="h-2 w-2 lg:h-2.5 lg:w-2.5" /> K
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-5 gap-1.5 lg:gap-2">
                  <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-1.5 lg:p-2 flex items-center gap-2 lg:gap-3 hover:bg-white/[0.04] transition-colors">
                     <div className="h-6 w-6 lg:h-8 lg:w-8 rounded bg-accent/5 text-accent flex items-center justify-center border border-accent/20 shrink-0">
                       <BookOpen className="h-3 w-3 lg:h-4 lg:w-4" />
                     </div>
                     <div className="min-w-0">
                       <div className="text-sm lg:text-lg font-semibold text-foreground truncate">12</div>
                       <div className="text-[6px] lg:text-[8px] text-muted-foreground uppercase tracking-widest leading-tight truncate">Documents<br/>Indexed</div>
                     </div>
                  </div>
                  <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-1.5 lg:p-2 flex items-center gap-2 lg:gap-3 hover:bg-white/[0.04] transition-colors">
                     <div className="h-6 w-6 lg:h-8 lg:w-8 rounded bg-[#00E5FF]/5 text-[#00E5FF] flex items-center justify-center border border-[#00E5FF]/20 shrink-0">
                       <Layers className="h-3 w-3 lg:h-4 lg:w-4" />
                     </div>
                     <div className="min-w-0">
                       <div className="text-sm lg:text-lg font-semibold text-foreground truncate">423</div>
                       <div className="text-[6px] lg:text-[8px] text-muted-foreground uppercase tracking-widest leading-tight truncate">Chunks<br/>Stored</div>
                     </div>
                  </div>
                  <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-1.5 lg:p-2 flex items-center gap-2 lg:gap-3 hover:bg-white/[0.04] transition-colors">
                     <div className="h-6 w-6 lg:h-8 lg:w-8 rounded bg-[#14B8A6]/5 text-[#14B8A6] flex items-center justify-center border border-[#14B8A6]/20 shrink-0">
                       <Fingerprint className="h-3 w-3 lg:h-4 lg:w-4" />
                     </div>
                     <div className="min-w-0">
                       <div className="text-sm lg:text-lg font-semibold text-foreground truncate">38.2K</div>
                       <div className="text-[6px] lg:text-[8px] text-muted-foreground uppercase tracking-widest leading-tight truncate">Tokens<br/>Total</div>
                     </div>
                  </div>
                  <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-1.5 lg:p-2 flex items-center gap-2 lg:gap-3 hover:bg-white/[0.04] transition-colors">
                     <div className="h-6 w-6 lg:h-8 lg:w-8 rounded bg-[#8B5CF6]/5 text-[#8B5CF6] flex items-center justify-center border border-[#8B5CF6]/20 shrink-0">
                       <Activity className="h-3 w-3 lg:h-4 lg:w-4" />
                     </div>
                     <div className="min-w-0">
                       <div className="text-sm lg:text-lg font-semibold text-foreground truncate">60</div>
                       <div className="text-[6px] lg:text-[8px] text-muted-foreground uppercase tracking-widest leading-tight truncate">Eval Questions<br/>Benchmark</div>
                     </div>
                  </div>
                  <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-1.5 lg:p-2 flex items-center gap-2 lg:gap-3 hover:bg-white/[0.04] transition-colors">
                     <div className="h-6 w-6 lg:h-8 lg:w-8 rounded bg-[#F59E0B]/5 text-[#F59E0B] flex items-center justify-center border border-[#F59E0B]/20 shrink-0">
                       <Clock className="h-3 w-3 lg:h-4 lg:w-4" />
                     </div>
                     <div className="min-w-0">
                       <div className="flex items-baseline gap-0.5 lg:gap-1">
                         <span className="text-sm lg:text-lg font-semibold text-foreground truncate">107</span>
                         <span className="text-[8px] lg:text-[9px] text-foreground font-mono">ms</span>
                       </div>
                       <div className="text-[6px] lg:text-[8px] text-muted-foreground uppercase tracking-widest leading-tight truncate">P95 Latency<br/>Reranker</div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Right Side: System Status */}
              <div className="w-[260px] lg:w-[280px] shrink-0 bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-2 lg:p-3 flex flex-col h-full min-h-0">
                <div className="flex items-center justify-between mb-1.5 lg:mb-2 shrink-0">
                  <h3 className="text-[10px] lg:text-xs text-muted-foreground uppercase tracking-widest font-medium">System Status</h3>
                  <span className="text-[9px] lg:text-[10px] text-accent flex items-center gap-1 cursor-pointer">View all <ChevronRight className="h-2.5 w-2.5 lg:h-3 lg:w-3" /></span>
                </div>
                <div className="space-y-1 lg:space-y-1.5 overflow-y-auto custom-scrollbar flex-1 pr-1.5 lg:pr-2 min-h-0">
                  {[
                    { name: "FastAPI Server", sub: "v0.1.0", icon: Server },
                    { name: "Vector Store", sub: "ChromaDB", icon: Database },
                    { name: "BM25 Index", sub: "In-Memory", icon: FileText },
                    { name: "Embeddings", sub: "BGE-M3", icon: Zap },
                    { name: "Reranker", sub: "Cross-Encoder", icon: Activity },
                    { name: "LLM Provider", sub: "Local (Llama.cpp)", icon: Command },
                  ].map((service, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                        <div className="h-5 w-5 lg:h-6 lg:w-6 rounded bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                          <service.icon className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                        </div>
                        <div className="min-w-0 pr-1.5 lg:pr-2">
                          <div className="text-[10px] lg:text-xs text-foreground font-medium truncate">{service.name}</div>
                          <div className="text-[8px] lg:text-[9px] text-muted-foreground truncate">{service.sub}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 lg:gap-1.5 shrink-0">
                        <div className="h-1 w-1 lg:h-1.5 lg:w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-[7px] lg:text-[8px] text-emerald-500 uppercase tracking-wider hidden xl:inline">Healthy</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-1.5 lg:mt-2 pt-1.5 lg:pt-2 border-t border-white/10 shrink-0">
                  <div>
                    <div className="text-[7px] lg:text-[8px] text-muted-foreground uppercase tracking-widest mb-0.5">Uptime</div>
                    <div className="text-[10px] lg:text-xs text-emerald-500">2h 47m</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[7px] lg:text-[8px] text-muted-foreground uppercase tracking-widest mb-0.5">Environment</div>
                    <div className="text-[10px] lg:text-xs text-emerald-500">Local Dev</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: 3 Equal Columns */}
            <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
              
              {/* Chart Section */}
              <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col min-h-0 h-full">
                <div className="flex items-center justify-between mb-2 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-7 w-7 lg:h-8 lg:w-8 rounded-full bg-white/5 text-[10px] lg:text-xs font-mono border border-white/10 shrink-0">
                      VS
                    </div>
                    <div>
                      <h3 className="text-[9px] lg:text-[10px] text-foreground uppercase tracking-widest font-medium">Retrieval Performance</h3>
                      <p className="text-[9px] lg:text-[10px] text-muted-foreground">Benchmark Results</p>
                    </div>
                  </div>
                  <div className="text-[9px] lg:text-[10px] text-muted-foreground flex items-center gap-1 cursor-pointer bg-white/5 px-2 py-1 rounded border border-white/10 hover:bg-white/10 transition-colors shrink-0">
                    Recall@5 <ChevronDown className="h-3 w-3" />
                  </div>
                </div>

                <div className="flex-1 min-h-[60px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FFFFFF10" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#8B929A" }} dy={5} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#8B929A" }} tickFormatter={(val) => `${val}%`} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }}
                        contentStyle={{ backgroundColor: '#0A0C10', borderColor: '#FFFFFF12', borderRadius: '8px' }}
                        itemStyle={{ color: '#F0F2F5', fontSize: '12px' }}
                      />
                      <Bar dataKey="recall" radius={[4, 4, 0, 0]} maxBarSize={30}>
                        {
                          performanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-4 gap-1 lg:gap-2 mt-2 pt-2 border-t border-white/10 shrink-0">
                   <div>
                     <div className="text-[8px] lg:text-[9px] text-muted-foreground uppercase tracking-widest mb-0.5 lg:mb-1">Recall@10</div>
                     <div className="text-xs lg:text-sm font-semibold text-foreground">51.7%</div>
                   </div>
                   <div>
                     <div className="text-[8px] lg:text-[9px] text-muted-foreground uppercase tracking-widest mb-0.5 lg:mb-1">Hit Rate@5</div>
                     <div className="text-xs lg:text-sm font-semibold text-foreground">54.0%</div>
                   </div>
                   <div>
                     <div className="text-[8px] lg:text-[9px] text-muted-foreground uppercase tracking-widest mb-0.5 lg:mb-1">MRR@10</div>
                     <div className="text-xs lg:text-sm font-semibold text-foreground">0.525</div>
                   </div>
                   <div>
                     <div className="text-[8px] lg:text-[9px] text-muted-foreground uppercase tracking-widest mb-0.5 lg:mb-1">P95 Latency</div>
                     <div className="text-xs lg:text-sm font-semibold text-foreground">16.6ms</div>
                   </div>
                </div>
                
                <div className="mt-2 lg:mt-3 flex justify-center shrink-0">
                   <button className="text-[8px] lg:text-[9px] text-accent hover:text-accent/80 flex items-center gap-1 transition-colors uppercase tracking-widest">
                     View full evaluation <ArrowUpRight className="h-3 w-3" />
                   </button>
                </div>
              </div>

              {/* Recent Queries */}
              <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col min-h-0 h-full">
                <div className="flex items-center justify-between mb-3 shrink-0">
                  <h3 className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Recent Queries</h3>
                  <span className="text-[10px] text-accent flex items-center gap-1 cursor-pointer">View all <ChevronRight className="h-3 w-3" /></span>
                </div>
                <div className="space-y-3 lg:space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2 min-h-0">
                  {[
                    { q: "How does authentication work for checkout?", type: "Hybrid RRF", time: "2.1s", ago: "Just now" },
                    { q: "Explain payment processing architecture", type: "Hybrid RRF", time: "1.8s", ago: "2m ago" },
                    { q: "What database is used for storing orders?", type: "Vector Search", time: "1.4s", ago: "5m ago" },
                    { q: "How does inventory synchronization work?", type: "Hybrid RRF", time: "2.6s", ago: "12m ago" },
                    { q: "What is the retry policy for failed payments?", type: "BM25", time: "1.2s", ago: "18m ago" }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-start group cursor-pointer" onClick={() => { setQuery(item.q); setShowResult(true); }}>
                      <div className="flex gap-2 lg:gap-3 max-w-[75%] min-w-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-border/40 mt-1.5 group-hover:bg-accent transition-colors shrink-0"></div>
                        <div className="min-w-0 pr-2">
                          <p className="text-xs text-foreground truncate">{item.q}</p>
                          <p className="text-[9px] lg:text-[10px] text-muted-foreground mt-0.5">{item.type}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] lg:text-xs text-foreground flex items-center justify-end gap-0.5">{item.time} <ChevronRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" /></p>
                        <p className="text-[8px] lg:text-[9px] text-muted-foreground mt-0.5">{item.ago}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Feed */}
              <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col min-h-0 h-full">
                <div className="flex items-center justify-between mb-3 shrink-0">
                  <h3 className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Activity Feed</h3>
                  <span className="text-[10px] text-accent flex items-center gap-1 cursor-pointer">Live <ChevronRight className="h-3 w-3" /></span>
                </div>
                <div className="space-y-4 lg:space-y-5 overflow-y-auto custom-scrollbar flex-1 pr-2 min-h-0">
                   <div className="flex gap-3 min-w-0">
                     <div className="h-6 w-6 lg:h-7 lg:w-7 rounded bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                       <File className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-muted-foreground" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-baseline">
                         <p className="text-xs text-foreground truncate pr-2">Document ingested</p>
                         <span className="text-[8px] lg:text-[9px] text-muted-foreground shrink-0">2m ago</span>
                       </div>
                       <p className="text-[9px] lg:text-[10px] text-muted-foreground mt-0.5 truncate">api-reference.md</p>
                     </div>
                   </div>
                   <div className="flex gap-3 min-w-0">
                     <div className="h-6 w-6 lg:h-7 lg:w-7 rounded bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                       <CheckCircle2 className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-muted-foreground" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-baseline">
                         <p className="text-xs text-foreground truncate pr-2">Benchmark eval completed</p>
                         <span className="text-[8px] lg:text-[9px] text-muted-foreground shrink-0">15m ago</span>
                       </div>
                       <p className="text-[9px] lg:text-[10px] text-muted-foreground mt-0.5 truncate">60 questions • 4 strategies</p>
                     </div>
                   </div>
                   <div className="flex gap-3 min-w-0">
                     <div className="h-6 w-6 lg:h-7 lg:w-7 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                       <Activity className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-emerald-500" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-baseline">
                         <p className="text-xs text-foreground truncate pr-2">System health check</p>
                         <span className="text-[8px] lg:text-[9px] text-muted-foreground shrink-0">1h ago</span>
                       </div>
                       <p className="text-[9px] lg:text-[10px] text-muted-foreground mt-0.5 truncate">All systems operational</p>
                     </div>
                   </div>
                   <div className="flex gap-3 min-w-0">
                     <div className="h-6 w-6 lg:h-7 lg:w-7 rounded bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                       <File className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-muted-foreground" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-baseline">
                         <p className="text-xs text-foreground truncate pr-2">New document uploaded</p>
                         <span className="text-[8px] lg:text-[9px] text-muted-foreground shrink-0">2h ago</span>
                       </div>
                       <p className="text-[9px] lg:text-[10px] text-muted-foreground mt-0.5 truncate">checkout-flow.md</p>
                     </div>
                   </div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        // TRACE RESULTS VIEW
        <>
          <div className="flex-1 overflow-y-auto p-6 lg:p-10">
            <div className="mx-auto max-w-4xl space-y-8">
              <div className="space-y-12">
                {/* User Query */}
                <div className="space-y-3">
                  <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></div> User Request
                  </div>
                  <div className="text-2xl font-medium text-foreground tracking-tight ml-3.5">
                    {query || "How does authentication work for checkout?"}
                  </div>
                </div>

                {/* Mnemora Response */}
                <div className="space-y-5">
                  <div className="text-[11px] font-mono text-accent uppercase tracking-widest flex items-center gap-2">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent shadow-[0_0_8px_rgba(0,229,255,0.8)]"></span>
                    </div> 
                    Neural Response
                  </div>
                  
                  <div className="text-foreground/90 leading-relaxed max-w-4xl text-lg ml-4 font-light">
                    Authentication is handled through the Identity Service using short-lived JWT access tokens. All protected APIs, including checkout endpoints, require a valid token in the Authorization header.
                    <sup className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-surface/80 border border-border/50 text-[10px] font-mono text-muted-foreground hover:border-accent hover:text-accent hover:shadow-[0_0_10px_rgba(0,229,255,0.3)] transition-all cursor-pointer">1</sup>
                  </div>

                  {/* Sources list */}
                  <div className="flex flex-wrap gap-3 pt-4 ml-4">
                    <div className="inline-flex items-center gap-2 rounded border border-border/30 bg-surface/20 px-3 py-1.5 text-xs text-muted-foreground hover:bg-surface/60 hover:border-border/60 hover:text-foreground cursor-pointer transition-all">
                      <FileText className="h-3.5 w-3.5" /> auth-service.md <span className="text-accent font-mono ml-2 border border-accent/20 bg-accent/10 px-1 rounded text-[10px]">P.4</span>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded border border-border/30 bg-surface/20 px-3 py-1.5 text-xs text-muted-foreground hover:bg-surface/60 hover:border-border/60 hover:text-foreground cursor-pointer transition-all">
                      <FileText className="h-3.5 w-3.5" /> checkout-architecture.md
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-border/10 via-border/40 to-border/10 my-10"></div>

                {/* Retrieval Trace */}
                <div className="space-y-4 pb-20">
                  <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5" /> Telemetry Trace
                  </div>
                  
                  <div className="rounded-lg border border-border/40 bg-[#070b0e] overflow-hidden font-mono text-sm shadow-xl">
                    <div className="p-4 bg-background/50 border-b border-border/40 flex justify-between items-center cursor-pointer hover:bg-surface/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground text-xs uppercase tracking-widest">Pipeline Execution</span>
                      </div>
                      <div className="flex items-center gap-2 bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
                        <span className="text-xs text-accent">605ms</span>
                      </div>
                    </div>
                    
                    <div className="p-5 space-y-3.5 text-muted-foreground/80 bg-background/30 text-[13px]">
                      <div className="flex justify-between items-center text-foreground">
                        <span className="flex items-center gap-2"><span className="text-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)] h-2 w-2 rounded-full inline-block"></span> Query received</span>
                        <span className="text-xs">0ms</span>
                      </div>
                      
                      <div className="pl-3 border-l border-border/30 ml-[3px] space-y-4 py-2">
                        <div className="flex justify-between items-center pl-4 relative before:absolute before:left-0 before:top-1/2 before:w-4 before:h-px before:bg-border/30">
                          <span>Embedding generated</span>
                          <span className="text-xs font-medium">12ms</span>
                        </div>
                        
                        <div className="flex justify-between items-start pl-4 relative before:absolute before:left-0 before:top-3 before:w-4 before:h-px before:bg-border/30">
                          <div className="space-y-1.5">
                            <div className="text-foreground/90">Vector search</div>
                            <div className="text-[11px] text-muted-foreground/50">└── 5 candidates</div>
                          </div>
                          <span className="text-xs mt-0.5">16ms</span>
                        </div>

                        <div className="flex justify-between items-start pl-4 relative before:absolute before:left-0 before:top-3 before:w-4 before:h-px before:bg-border/30">
                          <div className="space-y-1.5">
                            <div className="text-foreground/90">BM25 search</div>
                            <div className="text-[11px] text-muted-foreground/50">└── 5 candidates</div>
                          </div>
                          <span className="text-xs mt-0.5">0.3ms</span>
                        </div>

                        <div className="flex justify-between items-start pl-4 relative before:absolute before:left-0 before:top-3 before:w-4 before:h-px before:bg-border/30">
                          <div className="space-y-1.5">
                            <div className="text-emerald-400 font-medium">RRF fusion</div>
                            <div className="text-[11px] text-emerald-400/50">└── 8 unique candidates</div>
                          </div>
                          <span className="text-xs mt-0.5 text-emerald-400">0.2ms</span>
                        </div>

                        <div className="flex justify-between items-start pl-4 relative before:absolute before:left-0 before:top-3 before:w-4 before:h-px before:bg-border/30">
                          <div className="space-y-1.5">
                            <div className="text-accent font-medium">Cross encoder reranking</div>
                            <div className="text-[11px] text-accent/50">└── 5 candidates</div>
                          </div>
                          <span className="text-xs mt-0.5 text-accent font-medium shadow-[0_0_10px_rgba(0,229,255,0.2)]">91ms</span>
                        </div>
                        
                        <div className="flex justify-between items-center pl-4 relative before:absolute before:left-0 before:top-1/2 before:w-4 before:h-px before:bg-border/30">
                          <span>Context assembled</span>
                          <span className="text-xs">2ms</span>
                        </div>
                        
                        <div className="flex justify-between items-center pl-4 relative before:absolute before:left-0 before:top-1/2 before:w-4 before:h-px before:bg-border/30">
                          <span className="text-foreground/90">LLM generation</span>
                          <span className="text-xs">482ms</span>
                        </div>
                        
                        <div className="flex justify-between items-center pl-4 relative before:absolute before:left-0 before:top-1/2 before:w-4 before:h-px before:bg-border/30">
                          <span>Citation validation</span>
                          <span className="text-xs">4ms</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-3 mt-2 border-t border-border/20 font-medium text-foreground">
                        <span className="uppercase tracking-widest text-[11px]">Total Latency</span>
                        <span className="text-xs text-accent">605ms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Input Area (Bottom Sticky) */}
          <div className="p-4 border-t border-border/20 bg-[#070b0e]/95 backdrop-blur-md">
            <div className="mx-auto max-w-4xl relative">
              <form onSubmit={handleSearch} className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask anything about your knowledge base..."
                  className="h-14 w-full bg-surface/50 border-border/60 pl-12 pr-14 text-base focus-visible:ring-accent/50 rounded-xl"
                  disabled={isSearching}
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={!query || isSearching}
                  className="absolute right-2 h-10 w-10 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
