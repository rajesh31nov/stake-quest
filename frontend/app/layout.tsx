import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { WalletProvider } from "@/components/providers/wallet-provider";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "StakeQuest - Soroban Decentralized Challenge & Escrow Platform",
  description:
    "Decentralized accountability platform built on Stellar Soroban smart contracts. Lock XLM collateral, complete real-world challenges, and prove your commitment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <QueryProvider>
          <WalletProvider>
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
              {children}
            </main>
          </WalletProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
