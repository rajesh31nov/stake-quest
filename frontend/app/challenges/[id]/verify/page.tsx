"use client";

import React, { use } from "react";
import { useChallengeDetails } from "@/hooks/use-challenges";
import { VerifyProofCard } from "@/components/challenge/verify-proof-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";

interface VerifyPageProps {
  params: Promise<{ id: string }>;
}

export default function VerifyPage({ params }: VerifyPageProps) {
  const { id } = use(params);
  const challengeId = parseInt(id, 10);

  const { data: challenge, isLoading } = useChallengeDetails(isNaN(challengeId) ? null : challengeId);

  if (isLoading) {
    return <LoadingSpinner label="Loading submitted proof..." />;
  }

  if (!challenge) {
    return (
      <EmptyState
        title="Challenge Not Found"
        description="Cannot verify proof for a non-existent challenge."
      />
    );
  }

  return <VerifyProofCard challenge={challenge} />;
}
