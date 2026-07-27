import React from "react";
import { TransactionCenterItem } from "@/store/transaction-store";
import { TransactionCard } from "./transaction-card";
import { EmptyState } from "@/components/ui/empty-state";

interface TransactionListProps {
  transactions: TransactionCenterItem[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        title="No Transactions Recorded"
        description="Transaction history and live Soroban submission statuses will appear here."
        actionHref="/create"
        actionLabel="Create Challenge"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {transactions.map((tx) => (
        <TransactionCard key={tx.id} tx={tx} />
      ))}
    </div>
  );
}
