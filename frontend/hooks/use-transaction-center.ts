"use client";

import { useTransactionStore } from "@/store/transaction-store";

export function useTransactionCenter() {
  const { transactions, addTransaction, updateStatus, removeTransaction, clearAll } =
    useTransactionStore();

  const pendingCount = transactions.filter(
    (t) => t.status === "PENDING" || t.status === "PROCESSING" || t.status === "SIGNING" || t.status === "SUBMITTED"
  ).length;

  const failedCount = transactions.filter((t) => t.status === "FAILED" || t.status === "EXPIRED").length;
  const confirmedCount = transactions.filter((t) => t.status === "CONFIRMED").length;

  return {
    transactions,
    pendingCount,
    failedCount,
    confirmedCount,
    addTransaction,
    updateStatus,
    removeTransaction,
    clearAll,
  };
}
