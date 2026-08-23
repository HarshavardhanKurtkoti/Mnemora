"use client";

import { useState, useRef } from "react";
import { FileUp, FileText, CheckCircle2, MoreHorizontal, Loader2, X } from "lucide-react";
import { uploadDocument } from "@/lib/api";
const documents = [
  { id: 1, name: "auth-service.md", chunks: 38, type: "Markdown", status: "Ready" },
  { id: 2, name: "checkout-architecture.md", chunks: 51, type: "Markdown", status: "Ready" },
  { id: 3, name: "payment-api.md", chunks: 44, type: "Markdown", status: "Ready" },
  { id: 4, name: "database-schema.md", chunks: 63, type: "Markdown", status: "Ready" },
];

export default function KnowledgePage() {
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setUploadState('uploading');
    setUploadProgress(0);
    setUploadError("");

    // Simulated progress bar while waiting for backend
    const interval = setInterval(() => {
      setUploadProgress(p => p < 90 ? p + (Math.random() * 15) : p);
    }, 300);
    
    try {
      await uploadDocument(file);
      clearInterval(interval);
      setUploadProgress(100);
      setUploadState('success');
      
      // Auto close after 2s
      setTimeout(() => {
        setUploadState('idle');
        setSelectedFile(null);
      }, 2000);
    } catch (err: any) {
      clearInterval(interval);
      setUploadState('error');
      setUploadError(err.message || "Failed to upload document");
      console.error(err);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex-1 space-y-8 p-6 lg:p-12 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-medium tracking-tight text-foreground">Knowledge Base</h2>
          <p className="text-sm text-muted-foreground">Manage the documents ingested into the RAG vector store.</p>
        </div>
        <div className="flex items-center">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".txt,.md,.pdf,.csv"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadState === 'uploading'}
            className="inline-flex items-center justify-center rounded bg-foreground text-background px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/90 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-9"
          >
            <FileUp className="mr-2 h-4 w-4" /> Upload Document
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border/40 bg-background/40 backdrop-blur-xl p-5 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Total Documents</h3>
            <FileText className="h-4 w-4 text-muted-foreground/50" />
          </div>
          <div className="text-3xl font-mono mt-1 text-foreground">12</div>
        </div>
      </div>

      <div className="rounded-lg border border-border/40 bg-background/30 backdrop-blur-md overflow-hidden">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b border-border/40 bg-surface/20">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-10 px-4 text-left align-middle text-[11px] uppercase tracking-widest text-muted-foreground font-mono font-medium">Document</th>
                <th className="h-10 px-4 text-left align-middle text-[11px] uppercase tracking-widest text-muted-foreground font-mono font-medium">Chunks</th>
                <th className="h-10 px-4 text-left align-middle text-[11px] uppercase tracking-widest text-muted-foreground font-mono font-medium">Type</th>
                <th className="h-10 px-4 align-middle text-[11px] uppercase tracking-widest text-muted-foreground font-mono font-medium text-right">Status</th>
                <th className="h-10 px-4 w-[50px]"></th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b border-border/40 transition-colors hover:bg-surface/30 data-[state=selected]:bg-muted group">
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
                      <span className="font-medium text-foreground/90">{doc.name}</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle font-mono text-muted-foreground">{doc.chunks}</td>
                  <td className="p-4 align-middle text-muted-foreground">{doc.type}</td>
                  <td className="p-4 align-middle text-right">
                    <div className="inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-emerald-400/10 text-emerald-400 border-emerald-400/20">
                      <CheckCircle2 className="mr-1.5 h-3 w-3" />
                      {doc.status}
                    </div>
                  </td>
                  <td className="p-4 align-middle text-right">
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent h-8 w-8 text-muted-foreground/50 opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {uploadState !== 'idle' && selectedFile && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#070b0e]/90 backdrop-blur-xl border border-accent/20 shadow-[0_0_50px_rgba(0,229,255,0.1)] rounded-2xl w-full max-w-md p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0 opacity-50"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                   {uploadState === 'success' ? <CheckCircle2 className="h-6 w-6 text-emerald-400" /> : <FileUp className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    {uploadState === 'uploading' ? 'Uploading Document...' : 
                     uploadState === 'success' ? 'Upload Complete' : 'Upload Failed'}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px] mt-0.5">{selectedFile.name}</p>
                </div>
              </div>
              {uploadState === 'error' && (
                <button onClick={() => setUploadState('idle')} className="text-muted-foreground hover:text-foreground transition-colors">
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
                  <span className="text-muted-foreground">Progress</span>
                  <span className={uploadState === 'success' ? 'text-emerald-400' : 'text-accent'}>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ease-out ${uploadState === 'success' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-accent shadow-[0_0_10px_rgba(0,229,255,0.5)]'}`}
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
