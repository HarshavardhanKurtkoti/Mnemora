"use client";

import { FileUp, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const documents = [
  { id: 1, name: "auth-service.md", chunks: 38, type: "Markdown", status: "Ready" },
  { id: 2, name: "checkout-architecture.md", chunks: 51, type: "Markdown", status: "Ready" },
  { id: 3, name: "payment-api.md", chunks: 44, type: "Markdown", status: "Ready" },
  { id: 4, name: "database-schema.md", chunks: 63, type: "Markdown", status: "Ready" },
];

export default function KnowledgePage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Knowledge Base</h2>
        <div className="flex items-center space-x-2">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <FileUp className="mr-2 h-4 w-4" /> Upload
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-surface/30 border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Documents
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-surface/20 border-border/40">
        <CardHeader>
          <CardTitle>Corpus</CardTitle>
          <CardDescription>
            Manage the documents ingested into the RAG vector store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-surface/40">
              <TableRow className="border-border/40 hover:bg-transparent">
                <TableHead className="w-[300px]">Document</TableHead>
                <TableHead>Chunks</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id} className="border-border/40 cursor-pointer hover:bg-surface/50 transition-colors">
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {doc.name}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{doc.chunks}</TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {doc.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
