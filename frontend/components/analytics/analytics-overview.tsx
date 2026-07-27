"use client";

import React from "react";
import { BarChart3, PieChart, TrendingUp, ShieldCheck, Coins, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function AnalyticsOverview() {
  const { stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return <LoadingSpinner label="Calculating analytics metrics..." />;
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-amber-400" />
          Performance & Reward Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-1">Detailed breakdown of quest completion rates, XLM rewards, and transaction success rates.</p>
      </div>

      {/* Grid 1: Rate Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-800 bg-slate-900/70 p-6">
          <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Success Rate</CardTitle>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            <div className="text-3xl font-extrabold text-white">{stats.successRatePercentage}%</div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, stats.successRatePercentage)}%` }}
              />
            </div>
            <CardDescription className="text-xs text-slate-400">
              {stats.completedChallengesCount} completed vs {stats.failedChallengesCount} rejected proofs
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/70 p-6">
          <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Completion Rate</CardTitle>
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            <div className="text-3xl font-extrabold text-white">{stats.completionRatePercentage}%</div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, stats.completionRatePercentage)}%` }}
              />
            </div>
            <CardDescription className="text-xs text-slate-400">
              Active and completed quests out of total participation
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/70 p-6">
          <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Tx Success Rate</CardTitle>
            <RefreshCw className="w-5 h-5 text-amber-400" />
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            <div className="text-3xl font-extrabold text-white">
              {stats.successfulTransactions + stats.failedTransactions > 0
                ? Math.round((stats.successfulTransactions / (stats.successfulTransactions + stats.failedTransactions)) * 100)
                : 100}%
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${
                    stats.successfulTransactions + stats.failedTransactions > 0
                      ? Math.round((stats.successfulTransactions / (stats.successfulTransactions + stats.failedTransactions)) * 100)
                      : 100
                  }%`,
                }}
              />
            </div>
            <CardDescription className="text-xs text-slate-400">
              {stats.successfulTransactions} confirmed Soroban RPC transactions
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Grid 2: Reward & Refund Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-800 bg-slate-900/70 p-6">
          <CardHeader className="p-0 mb-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Coins className="w-5 h-5" />
              <CardTitle className="text-lg font-bold text-white">Escrow Rewards Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">Total XLM Staked (Challenger)</span>
              <span className="text-white font-mono font-bold">{stats.totalXlmStaked} XLM</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">Total Rewards Earned (Participant)</span>
              <span className="text-emerald-400 font-mono font-bold">{stats.totalXlmEarned} XLM</span>
            </div>
            <div className="flex justify-between items-center py-2 text-xs">
              <span className="text-slate-400 font-medium">Total Refunds Received</span>
              <span className="text-cyan-400 font-mono font-bold">{stats.totalRefundsReceived} XLM</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/70 p-6">
          <CardHeader className="p-0 mb-4">
            <div className="flex items-center gap-2 text-purple-400">
              <PieChart className="w-5 h-5" />
              <CardTitle className="text-lg font-bold text-white">Quest Lifecycle Distribution</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Active Quests</span>
              <span className="text-cyan-400 font-bold">{stats.activeChallengesCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Completed & Paid Quests</span>
              <span className="text-emerald-400 font-bold">{stats.completedChallengesCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Pending Invitations</span>
              <span className="text-amber-400 font-bold">{stats.pendingChallengesCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Expired & Refunded</span>
              <span className="text-slate-500 font-bold">{stats.expiredChallengesCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
