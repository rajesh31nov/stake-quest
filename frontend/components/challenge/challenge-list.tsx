import React from "react";
import { ChallengeModel } from "@/types/challenge";
import { ChallengeCard } from "./challenge-card";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ChallengeListProps {
  challenges: ChallengeModel[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ChallengeList({
  challenges,
  isLoading,
  emptyTitle = "No Challenges Found",
  emptyDescription = "There are no challenges matching this view yet.",
}: ChallengeListProps) {
  if (isLoading) {
    return <LoadingSpinner label="Loading challenges from Stellar Soroban..." />;
  }

  if (!challenges || challenges.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {challenges.map((ch) => (
        <ChallengeCard key={ch.id} challenge={ch} />
      ))}
    </div>
  );
}
