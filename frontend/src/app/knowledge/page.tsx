"use client";

import { useState, useRef, useEffect } from "react";
import { 
  FileUp, 
  FileText, 
  CheckCircle2, 
  MoreHorizontal, 
  Loader2, 
  X, 
  Layers, 
  BookOpen, 
  Fingerprint, 
  HardDrive,
  ArrowUpRight,
  Database,
  Search,
  Sparkles,
  RefreshCw,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadDocument, fetchOverviewStats } from "@/lib/api";
import { cn } from "@/lib/utils";

const INITIAL_DOCUMENTS = [
  { id: 1, name: "auth-service.md", chunks: 38, tokens: "3.4K", type: "Markdown", status: "Ready", size: "14.2 KB", updated: "2h ago" },
  { id: 2, name: "checkout-architecture.md", chunks: 51, tokens: "4.8K", type: "Markdown", status: "Ready", size: "19.8 KB", updated: "3h ago" },
  { id: 3, name: "payment-api.md", chunks: 44, tokens: "4.1K", type: "Markdown", status: "Ready", size: "16.5 KB", updated: "5h ago" },
  { id: 4, name: "database-schema.md", chunks: 63, tokens: "5.9K", type: "Markdown", status: "Ready", size: "24.1 KB", updated: "1d ago" },
  { id: 5, name: "inventory-sync.md", chunks: 29, tokens: "2.7K", type: "Markdown", status: "Ready", size: "11.0 KB", updated: "1d ago" },
  { id: 6, name: "api-gateway-routing.md", chunks: 42, tokens: "3.9K", type: "Markdown", status: "Ready", size: "15.7 KB", updated: "2d ago" },
];

export default function KnowledgePage() {
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
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
    setUploadState('uploading');
    setUploadProgress(0);
    setUploadError("");

    const interval = setInterval(() => {
      setUploadProgress((p) => {
        const next = p + Math.random() * 18;
        return next > 95 ? 95 : next;
      });
    }, 200);

    try {
      await uploadDocument(file);
      clearInterval(interval);
      setUploadProgress(100);
      setUploadState('success');

      // Add to document list
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
        setUploadState('idle');
        setSelectedFile(null);
      }, 1800);
    } catch (err: any) {
      clearInterval(interval);
      setUploadState('error');
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
    <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar p-4 lg:p-6 bg-transparent relative">
      {/* Ambient background lighting */}
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-[#00E5FF]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1600px] w-full mx-auto space-y-4">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl lg:text-2xl font-light tracking-wide text-foreground">
                Knowledge <span className="font-serif italic text-accent opacity-90">Base</span>
              </h1>
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 px-2.5 py-0.5 rounded-full">
                Data Layer
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 font-light leading-relaxed">
              Manage ingested documents, tokenized chunks, and vector embeddings in the active RAG store.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end md:self-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".txt,.md,.pdf,.csv,.json"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadState === 'uploading'}
              className="h-8 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 px-4 text-xs font-medium shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all"
            >
              <FileUp className="mr-1.5 h-3.5 w-3.5" />
              Upload Document
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-accent/10 text-accent border border-accent/20 flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm lg:text-base font-semibold text-foreground">{overviewStats.documents_indexed}</div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono">Documents Indexed</div>
            </div>
          </div>

          <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 flex items-center justify-center shrink-0">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm lg:text-base font-semibold text-foreground">{overviewStats.chunks_stored}</div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono">Chunks Stored</div>
            </div>
          </div>

          <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20 flex items-center justify-center shrink-0">
              <Fingerprint className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm lg:text-base font-semibold text-foreground">{(overviewStats.tokens_total / 1000).toFixed(1)}K</div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono">Tokens Total</div>
            </div>
          </div>

          <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 flex items-center justify-center shrink-0">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm lg:text-base font-semibold text-foreground">Cosine / 384d</div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono">Vector Space</div>
            </div>
          </div>
        </div>

        {/* Document Management Table */}
        <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-accent" />
              <h3 className="text-xs font-mono uppercase tracking-widest text-foreground font-medium">
                Indexed Documents
              </h3>
              <span className="text-[10px] font-mono text-muted-foreground ml-2">
                ({filteredDocs.length} files)
              </span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter documents..."
                className="w-full bg-white/[0.02] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-accent/40 transition-colors"
              />
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  <th className="py-3 px-4 font-medium">Document Name</th>
                  <th className="py-3 px-4 font-medium">Chunks</th>
                  <th className="py-3 px-4 font-medium">Tokens</th>
                  <th className="py-3 px-4 font-medium">Format</th>
                  <th className="py-3 px-4 font-medium">Size</th>
                  <th className="py-3 px-4 font-medium">Indexed</th>
                  <th className="py-3 px-4 font-medium text-right">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-light">
                {filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-7 w-7 rounded bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-accent group-hover:border-accent/30 transition-colors shrink-0">
                          <FileText className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-medium text-foreground group-hover:text-accent transition-colors truncate">
                          {doc.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">{doc.chunks} chunks</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">{doc.tokens}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-mono uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded text-muted-foreground">
                        {doc.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">{doc.size}</td>
                    <td className="py-3 px-4 text-muted-foreground text-[11px]">{doc.updated}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-muted-foreground/60 hover:text-accent p-1 transition-colors">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Upload Progress Modal */}
      {uploadState !== 'idle' && selectedFile && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#070b0e] border border-accent/20 shadow-[0_8px_32px_rgba(0,229,255,0.15)] rounded-2xl w-full max-w-md p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0 opacity-60" />

            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  {uploadState === 'success' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <FileUp className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    {uploadState === 'uploading'
                      ? 'Ingesting & Chunking Document...'
                      : uploadState === 'success'
                      ? 'Ingestion Complete'
                      : 'Upload Failed'}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate max-w-[220px] mt-0.5">
                    {selectedFile.name}
                  </p>
                </div>
              </div>
              {uploadState === 'error' && (
                <button
                  onClick={() => setUploadState('idle')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {uploadState === 'error' ? (
              <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                {uploadError}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-muted-foreground">Vectorizing Chunks</span>
                  <span className={uploadState === 'success' ? 'text-emerald-400' : 'text-accent'}>
                    {Math.round(uploadProgress)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-300 ease-out",
                      uploadState === 'success'
                        ? "bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        : "bg-accent shadow-[0_0_10px_rgba(0,229,255,0.5)]"
                    )}
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Document Detail Drawer/Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 lg:p-8">
          <div className="bg-[#070b0e] border border-accent/20 shadow-[0_0_50px_rgba(0,229,255,0.1)] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0 opacity-50" />

            <div className="flex justify-between items-center p-5 border-b border-white/5 bg-[#030405]/50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-medium text-foreground truncate">{selectedDoc.name}</h2>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="text-accent font-mono text-[10px]">{selectedDoc.chunks} Chunks</span>
                    <span>•</span>
                    <span className="font-mono text-[10px]">{selectedDoc.tokens} Tokens</span>
                    <span>•</span>
                    <span className="font-mono text-[10px] text-emerald-400">{selectedDoc.status}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDoc(null)}
                className="hover:bg-white/10 shrink-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[#0a0f14] space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#030405] border border-white/5 rounded-lg p-3">
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono">Format</div>
                  <div className="text-sm font-medium text-foreground mt-0.5">{selectedDoc.type}</div>
                </div>
                <div className="bg-[#030405] border border-white/5 rounded-lg p-3">
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono">File Size</div>
                  <div className="text-sm font-medium text-foreground mt-0.5">{selectedDoc.size}</div>
                </div>
                <div className="bg-[#030405] border border-white/5 rounded-lg p-3">
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono">Last Indexed</div>
                  <div className="text-sm font-medium text-foreground mt-0.5">{selectedDoc.updated}</div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  Document Metadata & Ingestion Config
                </div>
                <pre className="bg-[#030405] border border-white/5 rounded-lg p-3 text-[11px] font-mono text-muted-foreground overflow-x-auto">
                  {JSON.stringify({
                    document_id: selectedDoc.name,
                    source: selectedDoc.name,
                    chunk_strategy: "token-aware-splitter",
                    chunk_size: 800,
                    chunk_overlap: 100,
                    embedding_model: "BAAI/bge-small-en-v1.5",
                    vector_dimensions: 384,
                    bm25_indexed: true,
                    qdrant_collection: "rag_documents"
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
