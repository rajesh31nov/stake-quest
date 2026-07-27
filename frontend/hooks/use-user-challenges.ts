"use client";

import { useQuery } from "@tanstack/react-query";
import { challengeContractService } from "@/services/challenge-contract";
import { useWalletStore } from "@/store/wallet-store";
import { ChallengeModel } from "@/types/challenge";

export type ChallengeFilterType = "received" | "sent" | "all";

export function useUserChallenges(filter: ChallengeFilterType = "all") {
  const address = useWalletStore((s) => s.address);

  return useQuery({
    queryKey: ["user-challenges", address, filter],
    queryFn: async (): Promise<ChallengeModel[]> => {
      if (!address) return [];

      const count = await challengeContractService.getChallengeCount();
      const list: ChallengeModel[] = [];

      for (let id = 1; id <= count; id++) {
        const ch = await challengeContractService.getChallenge(id);
        if (ch) {
          if (filter === "received" && ch.participant === address) {
            list.push(ch);
          } else if (filter === "sent" && ch.challenger === address) {
            list.push(ch);
          } else if (filter === "all" && (ch.challenger === address || ch.participant === address)) {
            list.push(ch);
          }
        }
      }

      return list;
    },
    enabled: Boolean(address),
    staleTime: 10_000,
  });
}
