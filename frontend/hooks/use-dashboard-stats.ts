"use client";

import { useMemo } from "react";
import { useUserChallenges } from "./use-user-challenges";
import { useWalletStore } from "@/store/wallet-store";
import { useTransactionStore } from "@/store/transaction-store";
import { analyticsService } from "@/services/analytics-service";
import { UserDashboardStats } from "@/types/analytics";

export function useDashboardStats(): { stats: UserDashboardStats; isLoading: boolean } {
  const address = useWalletStore((s) => s.address);
  const { data: challenges, isLoading } = useUserChallenges("all");
  const transactions = useTransactionStore((s) => s.transactions);

  const stats = useMemo(() => {
    return analyticsService.computeDashboardStats(challenges || [], address, transactions);
  }, [challenges, address, transactions]);

  return {
    stats,
    isLoading,
  };
}
