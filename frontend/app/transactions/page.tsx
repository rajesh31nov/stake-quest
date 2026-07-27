"use client";

import React from "react";
import { History, Trash2 } from "lucide-react";
import { TransactionList } from "@/components/transaction/transaction-list";
import { useTransactionCenter } from "@/hooks/use-transaction-center";
import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
  const { transactions, clearAll } = useTransactionCenter();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Transaction Center</h1>
            <p className="text-xs text-slate-400">Track pending, confirmed, and failed Soroban contract submissions.</p>
          </div>
        </div>

        {transactions.length > 0 && (
          <Button size="sm" variant="outline" onClick={clearAll} className="gap-1.5 text-xs text-slate-400">
            <Trash2 className="w-3.5 h-3.5" />
            Clear History
          </Button>
        )}
      </div>

      <TransactionList transactions={transactions} />
    </div>
  );
}
