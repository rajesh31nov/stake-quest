import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { WalletProvider } from "@/components/providers/wallet-provider";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { MainContainer } from "@/components/layout/main-container";

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
            <Sidebar />
            <Navbar />
            <MainContainer>{children}</MainContainer>
          </WalletProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
