"use client";

import React from "react";
import Link from "next/link";
import { Coins, Trophy, Flame, ShieldCheck, PlusCircle, ArrowRight, Wallet } from "lucide-react";
import { StatCard } from "./stat-card";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { useWallet } from "@/hooks/use-wallet";
import { useUserChallenges } from "@/hooks/use-user-challenges";
import { ChallengeList } from "@/components/challenge/challenge-list";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function DashboardOverview() {
  const { isConnected, connectWallet } = useWallet();
  const { stats, isLoading: isStatsLoading } = useDashboardStats();
  const { data: challenges, isLoading: isChallengesLoading } = useUserChallenges("all");

  if (!isConnected) {
    return (
      <div className="space-y-12">
        <section className="text-center py-16 px-4 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
              <Trophy className="w-8 h-8" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Welcome to <span className="bg-gradient-to-r from-stellar-orange to-amber-400 bg-clip-text text-transparent">StakeQuest</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Connect your Stellar wallet to access your personal dashboard, track active XLM escrows, review challenge statistics, and claim rewards.
            </p>
            <Button size="lg" onClick={connectWallet} className="gap-2 shadow-xl">
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </Button>
          </div>
        </section>
      </div>
    );
  }

  if (isStatsLoading || isChallengesLoading) {
    return <LoadingSpinner label="Loading dashboard metrics from Soroban..." />;
  }

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Dashboard Overview</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time statistics for your Stellar Soroban accountability challenges.</p>
        </div>

        <Link href="/create">
          <Button className="gap-2 shadow-lg">
            <PlusCircle className="w-4 h-4" />
            Create Challenge
          </Button>
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total XLM Staked"
          value={`${stats.totalXlmStaked} XLM`}
          subtitle="Locked in Soroban Escrow"
          icon={<Coins className="w-5 h-5" />}
          iconBgColor="bg-amber-500/10 text-amber-400"
        />

        <StatCard
          title="Total XLM Earned"
          value={`${stats.totalXlmEarned} XLM`}
          subtitle="Released from Completed Quests"
          icon={<Trophy className="w-5 h-5" />}
          iconBgColor="bg-emerald-500/10 text-emerald-400"
        />

        <StatCard
          title="Active Challenges"
          value={stats.activeChallengesCount}
          subtitle={`${stats.pendingChallengesCount} pending invitations`}
          icon={<Flame className="w-5 h-5" />}
          iconBgColor="bg-cyan-500/10 text-cyan-400"
        />

        <StatCard
          title="Success Rate"
          value={`${stats.successRatePercentage}%`}
          subtitle={`${stats.completedChallengesCount} completed out of ${stats.completedChallengesCount + stats.failedChallengesCount + stats.expiredChallengesCount}`}
          icon={<ShieldCheck className="w-5 h-5" />}
          iconBgColor="bg-purple-500/10 text-purple-400"
        />
      </div>

      {/* Active Challenges Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Your Active & Pending Quests</h2>
          <Link href="/my-challenges" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
            View All ({challenges?.length || 0})
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ChallengeList
          challenges={(challenges || []).slice(0, 6)}
          emptyTitle="No Active Quests"
          emptyDescription="You don't have any active or pending challenges right now. Create one to lock XLM!"
        />
      </div>
    </div>
  );
}
