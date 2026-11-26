"use client";

import { useState, useRef, useEffect } from "react";
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
  HardDrive
} from "lucide-react";
import { uploadDocument, fetchOverviewStats } from "@/lib/api";

const INITIAL_DOCUMENTS = [
  { id: 1, name: "auth-service.md", chunks: 38, tokens: "3.4K", type: "Markdown", status: "Ready", size: "14.2 KB", updated: "2h ago" },
  { id: 2, name: "checkout-architecture.md", chunks: 51, tokens: "4.8K", type: "Markdown", status: "Ready", size: "19.8 KB", updated: "3h ago" },
  { id: 3, name: "payment-api.md", chunks: 44, tokens: "4.1K", type: "Markdown", status: "Ready", size: "16.5 KB", updated: "5h ago" },
  { id: 4, name: "database-schema.md", chunks: 63, tokens: "5.9K", type: "Markdown", status: "Ready", size: "24.1 KB", updated: "1d ago" },
  { id: 5, name: "inventory-sync.md", chunks: 29, tokens: "2.7K", type: "Markdown", status: "Ready", size: "11.0 KB", updated: "1d ago" },
  { id: 6, name: "api-gateway-routing.md", chunks: 42, tokens: "3.9K", type: "Markdown", status: "Ready", size: "15.7 KB", updated: "2d ago" },
];

export default function KnowledgePage() {
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [overviewStats, setOverviewStats] = useState({ documents_indexed: 12, chunks_stored: 423, tokens_total: 38200 });
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [documentsList, setDocumentsList] = useState(INITIAL_DOCUMENTS);
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

      const newDoc = {
        id: Date.now(),
        name: file.name,
        chunks: Math.ceil(file.size / 500) || 12,
        tokens: `${(file.size / 300).toFixed(1)}K`,
        type: file.name.endsWith(".pdf") ? "PDF" : file.name.endsWith(".csv") ? "CSV" : "Markdown",
        status: "Ready",
        size: `${(file.size / 1024).toFixed(1)} KB`,
        updated: "Just now"
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

  const filteredDocs = documentsList.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-6 bg-background">
      <div className="max-w-6xl w-full mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-[2px] bg-accent inline-block" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-accent">
                Data Layer
              </span>
            </div>
            <h1 className="text-2xl font-normal tracking-tight text-foreground">
              Knowledge <em className="font-serif italic text-accent font-normal">Base</em>
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Manage ingested documentation, chunk topologies, and embedding vectors in the active RAG store.
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
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-accent text-[#091712] font-medium text-xs hover:bg-accent/90 disabled:opacity-40 transition-colors cursor-pointer"
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
            <div className="text-2xl font-semibold text-foreground tracking-tight tabular-nums">
              {overviewStats.documents_indexed}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Layers className="h-3.5 w-3.5 text-signal" />
              <span className="font-mono text-[10px] uppercase tracking-wider">Chunks Stored</span>
            </div>
            <div className="text-2xl font-semibold text-foreground tracking-tight tabular-nums">
              {overviewStats.chunks_stored}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <HardDrive className="h-3.5 w-3.5 text-foreground/70" />
              <span className="font-mono text-[10px] uppercase tracking-wider">Tokens Total</span>
            </div>
            <div className="text-2xl font-semibold text-foreground tracking-tight tabular-nums">
              {(overviewStats.tokens_total / 1000).toFixed(1)}K
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Database className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-mono text-[10px] uppercase tracking-wider">Vector Space</span>
            </div>
            <div className="text-base font-semibold text-foreground tracking-tight font-mono">
              Cosine / 384d
            </div>
          </div>
        </div>

        {/* Document Management Table Card */}
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-foreground font-medium">
                Indexed Files
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                ({filteredDocs.length} documents)
              </span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="w-full bg-surface-subtle border border-line rounded-md pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-accent/40 transition-colors font-light"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/30 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  <th className="py-2.5 px-4 font-medium">File Name</th>
                  <th className="py-2.5 px-4 font-medium">Chunks</th>
                  <th className="py-2.5 px-4 font-medium">Tokens</th>
                  <th className="py-2.5 px-4 font-medium">Format</th>
                  <th className="py-2.5 px-4 font-medium">Size</th>
                  <th className="py-2.5 px-4 font-medium">Indexed</th>
                  <th className="py-2.5 px-4 font-medium text-right">Status</th>
                  <th className="py-2.5 px-4 font-medium text-right">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className="hover:bg-raised transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                        <span className="font-medium text-foreground group-hover:text-accent transition-colors truncate">
                          {doc.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground tabular-nums">
                      {doc.chunks}
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground tabular-nums">
                      {doc.tokens}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-border bg-secondary text-muted-foreground">
                        {doc.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground tabular-nums">
                      {doc.size}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-[11px]">
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
                ))}
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
                <div className="h-10 w-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-accent">
                  {uploadState === "success" ? (
                    <CheckCircle2 className="h-5 w-5 text-signal" />
                  ) : (
                    <FileUp className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">
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
                  <span className="text-muted-foreground">Vectorizing Chunks</span>
                  <span className="text-accent">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
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
          <div className="bg-surface border border-line rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-border bg-surface-subtle">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-5 w-5 text-accent shrink-0" />
                <div className="min-w-0">
                  <h2 className="text-sm font-medium text-foreground truncate">{selectedDoc.name}</h2>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mt-0.5">
                    <span>{selectedDoc.chunks} Chunks</span>
                    <span>•</span>
                    <span>{selectedDoc.tokens} Tokens</span>
                    <span>•</span>
                    <span className="text-signal">{selectedDoc.status}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-muted-foreground hover:text-foreground p-1 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
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

              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                  Ingestion Metadata & Topology Config
                </span>
                <pre className="bg-surface-subtle border border-border rounded-lg p-3 text-[11px] font-mono text-muted-foreground overflow-x-auto leading-relaxed">
                  {JSON.stringify({
                    document_id: selectedDoc.name,
                    source: selectedDoc.name,
                    chunk_strategy: "token-aware-splitter",
                    chunk_size: 800,
                    chunk_overlap: 100,
                    embedding_model: "all-MiniLM-L6-v2",
                    vector_dimensions: 384,
                    bm25_indexed: true,
                    collection: "rag_documents"
                  }, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
