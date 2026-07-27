"use client";

import React from "react";
import { EventCategory } from "@/types/event";
import { useActivityFeed } from "@/hooks/use-activity-feed";
import { ActivityCard } from "./activity-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export function ActivityFeedList() {
  const { events, selectedCategory, isLoading, setCategory, refreshEvents } = useActivityFeed();

  const categories: { label: string; value: EventCategory }[] = [
    { label: "All Events", value: "ALL" },
    { label: "Creations", value: "CREATION" },
    { label: "Proofs", value: "PROOF" },
    { label: "Payouts", value: "PAYOUT" },
    { label: "Escrows", value: "ESCROW" },
  ];

  return (
    <div className="space-y-6">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat.value
                  ? "bg-gradient-to-r from-stellar-orange to-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <Button size="sm" variant="ghost" onClick={refreshEvents} className="text-xs text-amber-400">
          Refresh Stream
        </Button>
      </div>

      {/* Grid or Loader */}
      {isLoading ? (
        <LoadingSpinner label="Streaming contract events from Soroban RPC..." />
      ) : !events || events.length === 0 ? (
        <EmptyState
          title="No Contract Events Streamed"
          description="Real-time challenge creations, proof submissions, and escrow payouts will stream live here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <ActivityCard key={evt.id} event={evt} />
          ))}
        </div>
      )}
    </div>
  );
}
