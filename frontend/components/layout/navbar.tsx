"use client";

import Link from "next/link";
import { Trophy, PlusCircle, Inbox, Send, UserCheck, Activity, History } from "lucide-react";
import { WalletButton } from "@/components/wallet/wallet-button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-stellar-orange via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Trophy className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-400 bg-clip-text text-transparent">
              StakeQuest
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full uppercase">
              Soroban
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300">
          <Link href="/" className="hover:text-amber-400 transition-colors">
            Dashboard
          </Link>
          <Link href="/create" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            Create
          </Link>
          <Link href="/received" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
            <Inbox className="w-3.5 h-3.5 text-cyan-400" />
            Received
          </Link>
          <Link href="/sent" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-amber-400" />
            Sent
          </Link>
          <Link href="/my-challenges" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-purple-400" />
            My Challenges
          </Link>
          <Link href="/activity" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Activity
          </Link>
          <Link href="/transactions" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-cyan-400" />
            Tx Center
          </Link>
        </nav>

        {/* Right side Wallet Action */}
        <div className="flex items-center gap-4">
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
