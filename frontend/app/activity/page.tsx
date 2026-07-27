import React from "react";
import { Activity } from "lucide-react";
import { ActivityFeedList } from "@/components/activity/activity-feed-list";

export const metadata = {
  title: "Activity Feed - StakeQuest",
  description: "Real-time stream of Soroban smart contract events, challenge creations, proof submissions, and escrow payouts.",
};

export default function ActivityFeedPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Live Activity Feed</h1>
          <p className="text-xs text-slate-400">Real-time Soroban blockchain event stream across the StakeQuest ecosystem.</p>
        </div>
      </div>

      <ActivityFeedList />
    </div>
  );
}
