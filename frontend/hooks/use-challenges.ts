"use client";

import { useQuery } from "@tanstack/react-query";
import { challengeContractService } from "@/services/challenge-contract";

export function useChallengeDetails(challengeId: number | null) {
  return useQuery({
    queryKey: ["challenge", challengeId],
    queryFn: async () => {
      if (challengeId === null) return null;
      return await challengeContractService.getChallenge(challengeId);
    },
    enabled: challengeId !== null,
    staleTime: 10_000,
  });
}
