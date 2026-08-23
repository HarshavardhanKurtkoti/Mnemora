import { FileUp, FileText, CheckCircle2, MoreHorizontal } from "lucide-react";

const documents = [
  { id: 1, name: "auth-service.md", chunks: 38, type: "Markdown", status: "Ready" },
  { id: 2, name: "checkout-architecture.md", chunks: 51, type: "Markdown", status: "Ready" },
  { id: 3, name: "payment-api.md", chunks: 44, type: "Markdown", status: "Ready" },
  { id: 4, name: "database-schema.md", chunks: 63, type: "Markdown", status: "Ready" },
];

export default function KnowledgePage() {
  return (
    <div className="flex-1 space-y-8 p-6 lg:p-12 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-medium tracking-tight text-foreground">Knowledge Base</h2>
          <p className="text-sm text-muted-foreground">Manage the documents ingested into the RAG vector store.</p>
        </div>
        <div className="flex items-center">
          <button className="inline-flex items-center justify-center rounded bg-foreground text-background px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/90 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-9">
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
    </div>
  );
}
