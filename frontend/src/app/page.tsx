import Link from "next/link";
import { ArrowRight, FileText, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6 lg:p-12">
      <div className="w-full max-w-4xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">MNEMORA</h1>
          <p className="text-lg text-muted-foreground">RAG ENGINE • Evidence-grounded knowledge retrieval</p>
        </div>

        <Card className="bg-surface/40 backdrop-blur-sm border-border/60">
          <CardHeader>
            <CardTitle>Ask anything about your knowledge base...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end">
              <Link
                href="/ask"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                Ask Mnemora <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-surface/30 border-border/40">
            <CardContent className="flex flex-col items-start gap-1 p-4">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Documents</span>
              <span className="text-2xl font-mono text-foreground">12</span>
            </CardContent>
          </Card>
          <Card className="bg-surface/30 border-border/40">
            <CardContent className="flex flex-col items-start gap-1 p-4">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Eval Queries</span>
              <span className="text-2xl font-mono text-foreground">60</span>
            </CardContent>
          </Card>
          <Card className="bg-surface/30 border-border/40">
            <CardContent className="flex flex-col items-start gap-1 p-4">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Chunk Size</span>
              <span className="text-2xl font-mono text-foreground">800<span className="text-sm text-muted-foreground ml-1">tokens</span></span>
            </CardContent>
          </Card>
          <Card className="bg-surface/30 border-border/40">
            <CardContent className="flex flex-col items-start gap-1 p-4">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Strategy</span>
              <span className="text-xl font-mono text-foreground mt-1 text-accent">Hybrid + Reranker</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
