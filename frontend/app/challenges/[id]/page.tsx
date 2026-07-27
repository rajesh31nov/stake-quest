"use client";

import React, { use } from "react";
import { useChallengeDetails } from "@/hooks/use-challenges";
import { ChallengeDetailsView } from "@/components/challenge/challenge-details-view";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";

interface ChallengePageProps {
  params: Promise<{ id: string }>;
}

export default function ChallengeDetailPage({ params }: ChallengePageProps) {
  const { id } = use(params);
  const challengeId = parseInt(id, 10);

  const { data: challenge, isLoading } = useChallengeDetails(isNaN(challengeId) ? null : challengeId);

  if (isLoading) {
    return <LoadingSpinner label={`Fetching Challenge #${id} from Soroban...`} />;
  }

  if (!challenge) {
    return (
      <EmptyState
        title="Challenge Not Found"
        description={`No challenge found on Stellar network with ID #${id}.`}
      />
    );
  }

  return <ChallengeDetailsView challenge={challenge} />;
}
