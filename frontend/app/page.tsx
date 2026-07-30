import React from "react";
import Link from "next/link";
import {
  Trophy,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Sparkles,
  CheckCircle2,
  Coins,
  TrendingUp,
} from "lucide-react";

export const metadata = {
  title: "StakeQuest - Decentralized Accountability & Escrow Platform",
  description:
    "Decentralized accountability platform built on Stellar Soroban smart contracts. Lock XLM collateral into escrow, achieve your real-world goals, and earn rewards.",
};

export default function LandingPage() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden bg-slate-950 text-slate-100">
      {/* 3D Dynamic Ambient Glow & Grid Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Radial Gradients */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-amber-500/20 via-orange-500/10 to-purple-600/15 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 -right-40 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full" />

        {/* 3D Perspective Grid Line Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />
      </div>

      {/* Main Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 flex flex-col items-center text-center">
        {/* Floating Soroban Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/10 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span>Powered by Stellar Soroban Smart Contracts</span>
        </div>

        {/* Big Main Title: StakeQuest */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-6">
          <span className="bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent block">
            Stake
          </span>
          <span className="bg-gradient-to-r from-stellar-orange via-amber-400 to-yellow-300 bg-clip-text text-transparent block drop-shadow-2xl">
            Quest
          </span>
        </h1>

        {/* 1-2 Lines Subtitle Description */}
        <p className="max-w-2xl text-base sm:text-xl font-medium text-slate-300 leading-relaxed mb-10">
          Lock XLM collateral into automated Soroban smart contract escrows. Complete your real-world goals, submit proof of completion, and earn instant rewards.
        </p>

        {/* Primary CTA: Get Started Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-black bg-gradient-to-r from-stellar-orange via-amber-500 to-yellow-400 text-slate-950 shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        {/* 3D Floating Feature Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card 1 */}
          <div className="group relative p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-amber-500/40 hover:bg-slate-900/80 transition-all duration-300 shadow-xl hover:-translate-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lock className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">1. Stake XLM Escrow</h3>
            <p className="text-sm font-medium text-slate-400 leading-relaxed">
              Create a challenge for yourself or a friend and lock XLM collateral directly inside a Soroban smart contract.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all duration-300 shadow-xl hover:-translate-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-7 h-7 text-cyan-400" />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">2. Submit Evidence</h3>
            <p className="text-sm font-medium text-slate-400 leading-relaxed">
              Complete your challenge before the deadline and submit proof links (GitHub PRs, Strava logs, or project URLs).
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-emerald-500/40 hover:bg-slate-900/80 transition-all duration-300 shadow-xl hover:-translate-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Coins className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">3. Claim Rewards</h3>
            <p className="text-sm font-medium text-slate-400 leading-relaxed">
              Once verified by the challenger, locked funds are automatically released straight into your wallet on Stellar.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs font-semibold text-slate-500">
        <p>StakeQuest © 2026 — Built on Stellar Soroban Smart Contracts</p>
      </footer>
    </div>
  );
}
