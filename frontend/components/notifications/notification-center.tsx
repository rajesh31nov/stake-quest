"use client";

import React from "react";
import { Bell } from "lucide-react";
import { useTransactionCenter } from "@/hooks/use-transaction-center";
import { ToastBanner } from "@/components/ui/toast";

export function NotificationCenter() {
  const { pendingCount, failedCount, transactions } = useTransactionCenter();

  const recentFailure = transactions.find((t) => t.status === "FAILED" && t.error);

  if (pendingCount === 0 && failedCount === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm space-y-3">
      {pendingCount > 0 && (
        <ToastBanner
          type="info"
          title="Soroban RPC Processing"
          message={`${pendingCount} transaction(s) processing on Stellar Testnet...`}
        />
      )}

      {recentFailure && recentFailure.error && (
        <ToastBanner
          type="error"
          title={`Transaction Failed: ${recentFailure.title}`}
          message={recentFailure.error}
        />
      )}
    </div>
  );
}
