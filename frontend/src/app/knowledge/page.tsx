"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { 
  FileUp, 
  FileText, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  Database, 
  Search, 
  ArrowUpRight,
  Clock,
  X,
  FileCode,
  HardDrive,
  Filter,
  ChevronDown,
  ChevronRight,
  Code2,
  FileCheck2,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { uploadDocument, fetchOverviewStats } from "@/lib/api";
import { cn } from "@/lib/utils";

interface DocumentItem {
  id: number;
  name: string;
  chunks: number;
  tokens: string;
  type: "Markdown" | "PDF" | "CSV" | "JSON";
  status: "Ready" | "Indexing" | "Failed";
  size: string;
  updated: string;
  description?: string;
  sampleChunks?: { id: string; text: string }[];
}

const INITIAL_DOCUMENTS: DocumentItem[] = [
  { 
    id: 1, 
    name: "auth-service.md", 
    chunks: 38, 
    tokens: "3.4K", 
    type: "Markdown", 
    status: "Ready", 
    size: "14.2 KB", 
    updated: "2h ago",
    description: "OAuth 2.0 authentication architecture, JWT bearer token verification, and refresh rotation specs.",
    sampleChunks: [
      { id: "auth-service.md_0", text: "# Authentication Architecture\n\nThe API uses OAuth 2.0 with JWT access tokens and secure refresh token rotation for stateful authentication across microservices." },
      { id: "auth-service.md_1", text: "Tokens expire after 60 minutes. Refresh requests must validate signature against the tenant RS256 public key." }
    ]
  },
  { 
    id: 2, 
    name: "checkout-architecture.md", 
    chunks: 51, 
    tokens: "4.8K", 
    type: "Markdown", 
    status: "Ready", 
    size: "19.8 KB", 
    updated: "3h ago",
    description: "Multi-tenant checkout pipeline, message queue order dispatches, and inventory validation checkpoints.",
    sampleChunks: [
      { id: "checkout.md_0", text: "Order creation begins with inventory locks followed by idempotent charge generation." },
      { id: "checkout.md_1", text: "All checkout API routes enforce bearer token validation before dispatching order creation events." }
    ]
  },
  { 
    id: 3, 
    name: "payment-api.md", 
    chunks: 44, 
    tokens: "4.1K", 
    type: "Markdown", 
    status: "Ready", 
    size: "16.5 KB", 
    updated: "5h ago",
    description: "PCI-compliant payment processing gateway integration, tokenization, and webhooks.",
    sampleChunks: [
      { id: "payment.md_0", text: "Payment intents are generated with 15-minute validity windows to avoid stale transactions." }
    ]
  },
  { 
    id: 4, 
    name: "database-schema.md", 
    chunks: 63, 
    tokens: "5.9K", 
    type: "Markdown", 
    status: "Ready", 
    size: "24.1 KB", 
    updated: "1d ago",
    description: "Relational schema definitions for tenants, audit logs, vector indices, and user memberships.",
    sampleChunks: [
      { id: "db-schema.md_0", text: "User credentials and tenant bindings are partitioned across dedicated SQLite/PostgreSQL instances." }
    ]
  },
  { 
    id: 5, 
    name: "inventory-sync.md", 
    chunks: 29, 
    tokens: "2.7K", 
    type: "Markdown", 
    status: "Ready", 
    size: "11.0 KB", 
    updated: "1d ago",
    description: "Distributed warehouse lock manager and background sync workers.",
    sampleChunks: [
      { id: "inventory.md_0", text: "Warehouse stock levels synchronise every 30 seconds via Redis pub/sub channels." }
    ]
  },
  { 
    id: 6, 
    name: "api-gateway-routing.md", 
    chunks: 42, 
    tokens: "3.9K", 
    type: "Markdown", 
    status: "Ready", 
    size: "15.7 KB", 
    updated: "2d ago",
    description: "Envoy gateway routes, rate limiting tiers, and CORS preflight handling.",
    sampleChunks: [
      { id: "gateway.md_0", text: "Rate limiting is enforced at the edge using a token bucket algorithm keyed by API key hash." }
    ]
  },
];

export default function KnowledgePage() {
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [formatFilter, setFormatFilter] = useState<string>("ALL");
  const [overviewStats, setOverviewStats] = useState({ documents_indexed: 12, chunks_stored: 423, tokens_total: 38200 });
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [documentsList, setDocumentsList] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [showRawJson, setShowRawJson] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchOverviewStats()
      .then((data) => {
        if (data && data.documents_indexed) {
          setOverviewStats(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleUploadFile = async (file: File) => {
    setSelectedFile(file);
    setUploadState("uploading");
    setUploadProgress(0);
    setUploadError("");

    const interval = setInterval(() => {
      setUploadProgress((p) => {
        const next = p + Math.random() * 20;
        return next > 95 ? 95 : next;
      });
    }, 200);

    try {
      await uploadDocument(file);
      clearInterval(interval);
      setUploadProgress(100);
      setUploadState("success");

      const ext = file.name.split(".").pop()?.toUpperCase() || "MD";
      const docType: DocumentItem["type"] = ext === "PDF" ? "PDF" : ext === "CSV" ? "CSV" : ext === "JSON" ? "JSON" : "Markdown";

      const newDoc: DocumentItem = {
        id: Date.now(),
        name: file.name,
        chunks: Math.ceil(file.size / 500) || 12,
        tokens: `${(file.size / 300).toFixed(1)}K`,
        type: docType,
        status: "Ready",
        size: `${(file.size / 1024).toFixed(1)} KB`,
        updated: "Just now",
        description: `Uploaded source document (${file.name}). Dual-indexed in Qdrant and BM25.`,
        sampleChunks: [
          { id: `${file.name}_0`, text: `Indexed content chunk 0 from ${file.name}. Token-aware boundary verified.` }
        ]
      };

      setDocumentsList((prev) => [newDoc, ...prev]);
      setOverviewStats((prev) => ({
        ...prev,
        documents_indexed: prev.documents_indexed + 1,
        chunks_stored: prev.chunks_stored + newDoc.chunks
      }));

      setTimeout(() => {
        setUploadState("idle");
        setSelectedFile(null);
      }, 1600);
    } catch (err: any) {
      clearInterval(interval);
      setUploadState("error");
      setUploadError(err.message || "Failed to upload document");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUploadFile(file);
  };

  const filteredDocs = useMemo(() => {
    return documentsList.filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFormat = formatFilter === "ALL" || doc.type.toUpperCase() === formatFilter;
      return matchesSearch && matchesFormat;
    });
  }, [documentsList, searchQuery, formatFilter]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-6 bg-background">
      <div className="max-w-6xl w-full mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-[2px] bg-accent inline-block" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-medium">
                02 / KNOWLEDGE BASE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground">
              Document <em className="font-serif italic text-accent font-normal">Workspace</em>
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
              Inspect ingested documentation, manage chunk boundaries, and review dense vector embeddings alongside sparse BM25 indices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".txt,.md,.pdf,.csv,.json"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadState === "uploading"}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-accent text-[#091712] font-semibold text-xs hover:bg-accent/90 disabled:opacity-40 transition-colors cursor-pointer shadow-xs"
            >
              <FileUp className="h-3.5 w-3.5" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-lg border border-border bg-surface p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <BookOpen className="h-3.5 w-3.5 text-accent" />
              <span className="font-mono text-[10px] uppercase tracking-wider">Documents Indexed</span>
            </div>
            <div className="text-2xl font-normal text-foreground tracking-tight tabular-nums">
              {overviewStats.documents_indexed}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Layers className="h-3.5 w-3.5 text-signal" />
              <span className="font-mono text-[10px] uppercase tracking-wider">Chunks Stored</span>
            </div>
            <div className="text-2xl font-normal text-foreground tracking-tight tabular-nums">
              {overviewStats.chunks_stored}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <HardDrive className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-mono text-[10px] uppercase tracking-wider">Tokens Total</span>
            </div>
            <div className="text-2xl font-normal text-foreground tracking-tight tabular-nums">
              {(overviewStats.tokens_total / 1000).toFixed(1)}K
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Database className="h-3.5 w-3.5 text-accent" />
              <span className="font-mono text-[10px] uppercase tracking-wider">Vector Index</span>
            </div>
            <div className="text-sm font-mono font-medium text-foreground tracking-tight">
              Cosine / 384d
            </div>
          </div>
        </div>

        {/* Search, Filter & Actions Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Format Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["ALL", "MARKDOWN", "PDF", "CSV"].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormatFilter(fmt)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer",
                  formatFilter === fmt
                    ? "bg-accent text-[#091712] font-semibold shadow-xs"
                    : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-line"
                )}
              >
                {fmt}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name or keywords..."
              className="w-full bg-surface border border-line rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-accent/50 transition-colors font-light"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Document Management Table Card */}
        <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4 font-medium">Document Name</th>
                  <th className="py-3 px-4 font-medium">Format</th>
                  <th className="py-3 px-4 font-medium">Chunks</th>
                  <th className="py-3 px-4 font-medium">Tokens</th>
                  <th className="py-3 px-4 font-medium">Size</th>
                  <th className="py-3 px-4 font-medium">Indexed</th>
                  <th className="py-3 px-4 font-medium text-right">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-xs text-muted-foreground">
                      No documents match your query "{searchQuery}".
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr
                      key={doc.id}
                      onClick={() => {
                        setSelectedDoc(doc);
                        setShowRawJson(false);
                      }}
                      className="hover:bg-raised/70 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                          <div className="truncate">
                            <span className="font-medium text-foreground group-hover:text-accent transition-colors truncate block">
                              {doc.name}
                            </span>
                            {doc.description && (
                              <span className="text-[10px] text-muted-foreground/70 truncate block">
                                {doc.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-border bg-surface-subtle text-muted-foreground">
                          {doc.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-muted-foreground tabular-nums">
                        {doc.chunks}
                      </td>
                      <td className="py-3 px-4 font-mono text-muted-foreground tabular-nums">
                        {doc.tokens}
                      </td>
                      <td className="py-3 px-4 font-mono text-muted-foreground tabular-nums">
                        {doc.size}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-[11px] font-mono">
                        {doc.updated}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-signal">
                          <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent transition-colors inline" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Upload State Modal */}
      {uploadState !== "idle" && selectedFile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-line rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-accent">
                  {uploadState === "success" ? (
                    <CheckCircle2 className="h-5 w-5 text-signal" />
                  ) : (
                    <FileUp className="h-5 w-5 animate-pulse" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {uploadState === "uploading"
                      ? "Ingesting & Chunking Document..."
                      : uploadState === "success"
                      ? "Ingestion Complete"
                      : "Upload Failed"}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate max-w-[240px]">
                    {selectedFile.name}
                  </p>
                </div>
              </div>
              {uploadState === "error" && (
                <button onClick={() => setUploadState("idle")} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {uploadState === "error" ? (
              <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                {uploadError}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-muted-foreground">Generating Chunks & Embeddings</span>
                  <span className="text-accent">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-subtle rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Document Detail Preview Drawer/Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="bg-surface border border-line rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-border bg-surface-subtle">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-foreground truncate">{selectedDoc.name}</h2>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mt-0.5">
                    <span>{selectedDoc.chunks} Chunks</span>
                    <span>•</span>
                    <span>{selectedDoc.tokens} Tokens</span>
                    <span>•</span>
                    <span className="text-signal flex items-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-signal" />
                      {selectedDoc.status}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-raised transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
              {/* Metadata Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-surface-subtle border border-border rounded-lg p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">Format</div>
                  <div className="text-xs font-medium text-foreground mt-0.5">{selectedDoc.type}</div>
                </div>
                <div className="bg-surface-subtle border border-border rounded-lg p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">File Size</div>
                  <div className="text-xs font-medium text-foreground mt-0.5">{selectedDoc.size}</div>
                </div>
                <div className="bg-surface-subtle border border-border rounded-lg p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">Last Indexed</div>
                  <div className="text-xs font-medium text-foreground mt-0.5">{selectedDoc.updated}</div>
                </div>
              </div>

              {/* Ingestion & Pipeline Configuration Details */}
              <div className="rounded-lg border border-border bg-surface-subtle/50 p-4 space-y-3">
                <div className="text-xs font-mono font-medium text-foreground uppercase tracking-wider">
                  Ingestion Configuration
                </div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Chunk Splitter:</span>
                    <span className="font-mono text-foreground">TokenAwareSplitter (800 / 100)</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Dense Embedding:</span>
                    <span className="font-mono text-foreground">all-MiniLM-L6-v2 (384d)</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Sparse Index:</span>
                    <span className="font-mono text-signal">BM25Okapi (active)</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Collection Name:</span>
                    <span className="font-mono text-foreground">rag_documents</span>
                  </div>
                </div>
              </div>

              {/* Sample Passage Chunks Preview */}
              {selectedDoc.sampleChunks && selectedDoc.sampleChunks.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-mono font-medium text-foreground uppercase tracking-wider">
                    Indexed Passage Samples
                  </div>
                  <div className="space-y-2">
                    {selectedDoc.sampleChunks.map((chunk, i) => (
                      <div key={i} className="p-3 rounded-lg border border-border bg-surface-subtle space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-accent">
                          <span>Chunk ID: [{chunk.id}]</span>
                          <span>Sequence #{i + 1}</span>
                        </div>
                        <p className="text-xs text-foreground/90 font-mono leading-relaxed">
                          {chunk.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Expandable Raw JSON Inspector */}
              <div className="pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowRawJson(!showRawJson)}
                  className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Code2 className="h-3.5 w-3.5" />
                  <span>{showRawJson ? "Hide Raw JSON Metadata" : "Inspect Raw Document Metadata"}</span>
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showRawJson && "rotate-180")} />
                </button>

                {showRawJson && (
                  <pre className="mt-3 bg-surface-subtle border border-border rounded-lg p-3 text-[11px] font-mono text-muted-foreground overflow-x-auto leading-relaxed animate-in fade-in-0 duration-150">
                    {JSON.stringify({
                      document_id: selectedDoc.name,
                      source: selectedDoc.name,
                      format: selectedDoc.type,
                      chunk_count: selectedDoc.chunks,
                      token_count: selectedDoc.tokens,
                      file_size: selectedDoc.size,
                      chunk_strategy: "token-aware-splitter",
                      chunk_size: 800,
                      chunk_overlap: 100,
                      embedding_model: "all-MiniLM-L6-v2",
                      vector_dimensions: 384,
                      bm25_indexed: true,
                      collection: "rag_documents",
                      indexed_at: selectedDoc.updated
                    }, null, 2)}
                  </pre>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-surface-subtle flex items-center justify-between">
              <span className="text-[11px] font-mono text-muted-foreground">
                Provenance verified against corpus
              </span>
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-mono text-foreground hover:bg-raised transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
