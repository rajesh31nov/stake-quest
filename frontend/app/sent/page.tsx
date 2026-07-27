"use client";

import React from "react";
import { Send, Wallet } from "lucide-react";
import { ChallengeList } from "@/components/challenge/challenge-list";
import { useUserChallenges } from "@/hooks/use-user-challenges";
import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";

export default function SentChallengesPage() {
  const { isConnected, connectWallet } = useWallet();
  const { data: challenges, isLoading } = useUserChallenges("sent");

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-slate-800 bg-slate-900/50">
        <Wallet className="w-12 h-12 text-amber-400 mb-4" />
        <h3 className="text-xl font-bold text-slate-200 mb-2">Connect Your Wallet</h3>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          Connect your Stellar wallet to view challenges created by you.
        </p>
        <Button onClick={connectWallet}>Connect Wallet</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Send className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Sent Challenges</h1>
          <p className="text-xs text-slate-400">Challenges created by you with staked XLM in Soroban Escrow.</p>
        </div>
      </div>

      <ChallengeList
        challenges={challenges || []}
        isLoading={isLoading}
        emptyTitle="No Sent Challenges"
        emptyDescription="You haven't created any challenges yet."
      />
    </div>
  );
}
