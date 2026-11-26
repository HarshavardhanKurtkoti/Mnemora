import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mnemora — RAG Engineering Platform",
  description: "Production Retrieval-Augmented Generation engineering workspace and observability console.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className="h-screen w-screen overflow-hidden flex flex-col bg-background text-foreground antialiased selection:bg-mint/20">
        <Header />
        <div className="flex flex-1 overflow-hidden min-h-0">
          <Sidebar />
          <main className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden bg-background">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
