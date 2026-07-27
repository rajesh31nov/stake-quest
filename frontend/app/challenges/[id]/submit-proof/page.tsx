"use client";

import React, { use } from "react";
import { useChallengeDetails } from "@/hooks/use-challenges";
import { SubmitProofForm } from "@/components/challenge/submit-proof-form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";

interface SubmitProofPageProps {
  params: Promise<{ id: string }>;
}

export default function SubmitProofPage({ params }: SubmitProofPageProps) {
  const { id } = use(params);
  const challengeId = parseInt(id, 10);

  const { data: challenge, isLoading } = useChallengeDetails(isNaN(challengeId) ? null : challengeId);

  if (isLoading) {
    return <LoadingSpinner label="Loading challenge details..." />;
  }

  if (!challenge) {
    return (
      <EmptyState
        title="Challenge Not Found"
        description="Cannot submit proof for a non-existent challenge."
      />
    );
  }

  return <SubmitProofForm challengeId={challenge.id} challengeTitle={challenge.title} />;
}
