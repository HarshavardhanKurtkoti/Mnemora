"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  MessageSquare, 
  Library, 
  Layers, 
  LineChart, 
  Server, 
  ExternalLink, 
  ArrowRight,
  Sparkles,
  Command,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PAGES = [
  { name: "Ask", description: "Query documents with grounded answers and citations", href: "/ask", icon: MessageSquare, shortcut: "1" },
  { name: "Knowledge Base", description: "Manage source documents, chunks, and ingestion", href: "/knowledge", icon: Library, shortcut: "2" },
  { name: "Retrieval Inspector", description: "Multi-stage pipeline inspection across dense, sparse, and reranked", href: "/retrieval", icon: Layers, shortcut: "3" },
  { name: "Evaluation", description: "Ragas quality metrics, benchmark comparisons, and recall@k", href: "/evaluation", icon: LineChart, shortcut: "4" },
  { name: "System Topology", description: "Engine diagnostics, service health, and runtime configuration", href: "/system", icon: Server, shortcut: "5" },
];

const SAMPLE_QUERIES = [
  { text: "How does authentication work for checkout?", target: "/ask" },
  { text: "What is the token expiration policy?", target: "/ask" },
  { text: "Explain payment processing architecture", target: "/ask" },
  { text: "How does database connection pooling work?", target: "/ask" },
  { text: "Inspect retrieval candidates for auth service", target: "/retrieval" },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Close on Escape or open on Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const filteredPages = useMemo(() => {
    if (!search.trim()) return PAGES;
    const q = search.toLowerCase();
    return PAGES.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }, [search]);

  const filteredQueries = useMemo(() => {
    if (!search.trim()) return SAMPLE_QUERIES;
    const q = search.toLowerCase();
    return SAMPLE_QUERIES.filter(s => s.text.toLowerCase().includes(q));
  }, [search]);

  const totalItems = filteredPages.length + filteredQueries.length;

  const navigateTo = (url: string) => {
    onOpenChange(false);
    setSearch("");
    router.push(url);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={() => onOpenChange(false)} 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-xl border border-border bg-[#0d1615] shadow-2xl overflow-hidden z-10 animate-in fade-in-0 zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface-subtle">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, query, or jump to page..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            autoFocus
          />
          {search && (
            <button 
              onClick={() => setSearch("")} 
              className="text-muted-foreground hover:text-foreground text-xs p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <span className="text-[10px] font-mono text-muted-foreground/70 px-1.5 py-0.5 rounded border border-border bg-raised">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4 custom-scrollbar">
          {/* Pages */}
          {filteredPages.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 font-medium">
                Navigation
              </div>
              <div className="space-y-0.5">
                {filteredPages.map((page) => (
                  <button
                    key={page.href}
                    onClick={() => navigateTo(page.href)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors hover:bg-raised group"
                  >
                    <div className="flex items-center gap-3">
                      <page.icon className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                      <div>
                        <div className="font-medium text-foreground group-hover:text-accent transition-colors">
                          {page.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground line-clamp-1">
                          {page.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground/60 px-1.5 py-0.5 rounded border border-border">
                        ⌘{page.shortcut}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground/40 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sample Queries */}
          {filteredQueries.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 font-medium flex items-center justify-between">
                <span>Direct Inquiries</span>
                <Sparkles className="h-3 w-3 text-accent/70" />
              </div>
              <div className="space-y-0.5">
                {filteredQueries.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigateTo(`${q.target}?q=${encodeURIComponent(q.text)}`)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors hover:bg-raised group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0 group-hover:text-accent" />
                      <span className="text-foreground/90 group-hover:text-foreground truncate">
                        {q.text}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground/60 shrink-0">
                      {q.target === "/ask" ? "Ask" : "Inspect"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* External Links */}
          <div className="pt-2 border-t border-border/60">
            <a
              href="https://www.harshakurtkoti.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-raised text-muted-foreground hover:text-foreground transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-medium text-accent">HK</span>
                <span>Harsha Kurtkoti — Portfolio & System Architecture</span>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-accent" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border bg-surface-subtle flex items-center justify-between text-[11px] font-mono text-muted-foreground/70">
          <div className="flex items-center gap-2">
            <span>Use</span>
            <kbd className="px-1.5 py-0.5 rounded border border-border bg-raised text-[10px]">↑</kbd>
            <kbd className="px-1.5 py-0.5 rounded border border-border bg-raised text-[10px]">↓</kbd>
            <span>to navigate</span>
          </div>
          <span>Esc to exit</span>
        </div>
      </div>
    </div>
  );
}
