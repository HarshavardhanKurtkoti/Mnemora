"use client";

import { useState } from "react";
import { ArrowRight, FileText, ChevronDown, ChevronRight, Activity, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AskPage() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResult, setShowResult] = useState(true); // Default true for the mockup

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
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Mockup Result State */}
          {showResult ? (
            <div className="space-y-8">
              {/* User Query */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">You</div>
                <div className="text-xl font-medium text-foreground">How does authentication work for checkout?</div>
              </div>

              {/* Mnemora Response */}
              <div className="space-y-4">
                <div className="text-xs font-mono text-accent uppercase tracking-wider flex items-center gap-2">
                  <Activity className="h-3 w-3" /> Mnemora
                </div>
                
                <div className="text-foreground/90 leading-relaxed max-w-3xl">
                  Authentication is handled through the Identity Service using short-lived JWT access tokens. All protected APIs, including checkout endpoints, require a valid token in the Authorization header.
                  <sup className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] text-muted-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">1</sup>
                </div>

                {/* Sources list */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <div className="inline-flex items-center gap-1.5 rounded-md border border-border/40 bg-surface/30 px-2 py-1 text-xs text-muted-foreground hover:bg-surface/60 hover:text-foreground cursor-pointer transition-colors">
                    <FileText className="h-3 w-3" /> auth-service.md <span className="text-accent/70 font-mono ml-1">p.4</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-md border border-border/40 bg-surface/30 px-2 py-1 text-xs text-muted-foreground hover:bg-surface/60 hover:text-foreground cursor-pointer transition-colors">
                    <FileText className="h-3 w-3" /> checkout-architecture.md
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-md border border-border/40 bg-surface/30 px-2 py-1 text-xs text-muted-foreground hover:bg-surface/60 hover:text-foreground cursor-pointer transition-colors">
                    <FileText className="h-3 w-3" /> api-reference.md
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-border/40 my-8"></div>

              {/* Retrieval Trace */}
              <div className="space-y-4">
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Retrieval Trace</div>
                <Card className="bg-surface/20 border-border/40 overflow-hidden font-mono text-sm">
                  <div className="p-4 bg-surface/40 border-b border-border/40 flex justify-between items-center cursor-pointer hover:bg-surface/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">Show reasoning pipeline</span>
                    </div>
                    <span className="text-xs text-muted-foreground">605ms</span>
                  </div>
                  
                  <div className="p-4 space-y-3 text-muted-foreground">
                    <div className="flex justify-between items-center text-foreground">
                      <span className="flex items-center gap-2"><span className="text-accent">●</span> Query received</span>
                      <span className="text-xs">0ms</span>
                    </div>
                    
                    <div className="pl-2 border-l border-border/40 ml-1.5 space-y-3 py-1">
                      <div className="flex justify-between items-center pl-4 relative before:absolute before:left-0 before:top-1/2 before:w-4 before:h-px before:bg-border/40">
                        <span>Embedding generated</span>
                        <span className="text-xs">12ms</span>
                      </div>
                      
                      <div className="flex justify-between items-start pl-4 relative before:absolute before:left-0 before:top-3 before:w-4 before:h-px before:bg-border/40">
                        <div className="space-y-1">
                          <div>Vector search</div>
                          <div className="text-xs text-foreground/50">└── 5 candidates</div>
                        </div>
                        <span className="text-xs mt-1">16ms</span>
                      </div>

                      <div className="flex justify-between items-start pl-4 relative before:absolute before:left-0 before:top-3 before:w-4 before:h-px before:bg-border/40">
                        <div className="space-y-1">
                          <div>BM25 search</div>
                          <div className="text-xs text-foreground/50">└── 5 candidates</div>
                        </div>
                        <span className="text-xs mt-1">0.3ms</span>
                      </div>

                      <div className="flex justify-between items-start pl-4 relative before:absolute before:left-0 before:top-3 before:w-4 before:h-px before:bg-border/40">
                        <div className="space-y-1">
                          <div className="text-accent/80">RRF fusion</div>
                          <div className="text-xs text-foreground/50">└── 8 unique candidates</div>
                        </div>
                        <span className="text-xs mt-1 text-accent/80">0.2ms</span>
                      </div>

                      <div className="flex justify-between items-start pl-4 relative before:absolute before:left-0 before:top-3 before:w-4 before:h-px before:bg-border/40">
                        <div className="space-y-1">
                          <div className="text-accent">Cross encoder reranking</div>
                          <div className="text-xs text-foreground/50">└── 5 candidates</div>
                        </div>
                        <span className="text-xs mt-1 text-accent">91ms</span>
                      </div>
                      
                      <div className="flex justify-between items-center pl-4 relative before:absolute before:left-0 before:top-1/2 before:w-4 before:h-px before:bg-border/40">
                        <span>Context assembled</span>
                        <span className="text-xs">2ms</span>
                      </div>
                      
                      <div className="flex justify-between items-center pl-4 relative before:absolute before:left-0 before:top-1/2 before:w-4 before:h-px before:bg-border/40">
                        <span className="text-foreground">LLM generation</span>
                        <span className="text-xs">482ms</span>
                      </div>
                      
                      <div className="flex justify-between items-center pl-4 relative before:absolute before:left-0 before:top-1/2 before:w-4 before:h-px before:bg-border/40">
                        <span>Citation validation</span>
                        <span className="text-xs">4ms</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 font-semibold text-foreground">
                      <span>TOTAL</span>
                      <span className="text-xs text-accent">605ms</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
              <Activity className="h-12 w-12 text-muted-foreground/30 animate-pulse" />
              <p className="text-muted-foreground">Ask a question to see the RAG pipeline in action.</p>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border/40 bg-background/80 backdrop-blur-md">
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
    </div>
  );
}
