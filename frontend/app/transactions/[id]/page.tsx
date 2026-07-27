"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTransactionCenter } from "@/hooks/use-transaction-center";
import { TransactionCard } from "@/components/transaction/transaction-card";
import { EmptyState } from "@/components/ui/empty-state";

interface TransactionDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function TransactionDetailsPage({ params }: TransactionDetailsPageProps) {
  const { id } = use(params);
  const { transactions } = useTransactionCenter();

  const tx = transactions.find((t) => t.id === id);

  if (!tx) {
    return (
      <EmptyState
        title="Transaction Not Found"
        description={`No active or recent transaction recorded with ID "${id}".`}
        actionHref="/transactions"
        actionLabel="View Transaction History"
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/transactions" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400">
        <ArrowLeft className="w-4 h-4" />
        Back to Transaction Center
      </Link>

      <TransactionCard tx={tx} />
    </div>
  );
}
