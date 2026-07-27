import React from "react";
import { CheckCircle2, AlertTriangle, Clock, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExplorerLink } from "./explorer-link";
import { RetryButton } from "./retry-button";
import { TransactionCenterItem } from "@/store/transaction-store";

interface TransactionCardProps {
  tx: TransactionCenterItem;
}

export function TransactionCard({ tx }: TransactionCardProps) {
  const isConfirmed = tx.status === "CONFIRMED";
  const isFailed = tx.status === "FAILED" || tx.status === "EXPIRED" || tx.status === "CANCELLED";
  const isPending = !isConfirmed && !isFailed;

  const statusBadges = {
    PENDING: <Badge variant="default">Pending</Badge>,
    PREPARING: <Badge variant="default">Preparing XDR</Badge>,
    SIGNING: <Badge variant="default">Awaiting Signature</Badge>,
    SUBMITTED: <Badge variant="active">Submitted</Badge>,
    PROCESSING: <Badge variant="active">Processing</Badge>,
    CONFIRMED: <Badge variant="completed">Confirmed</Badge>,
    FAILED: <Badge variant="rejected">Failed</Badge>,
    EXPIRED: <Badge variant="expired">Expired</Badge>,
    CANCELLED: <Badge variant="expired">Cancelled</Badge>,
  };

  return (
    <Card className="border-slate-800 bg-slate-900/70 p-5 shadow-lg flex flex-col justify-between">
      <div>
        <CardHeader className="p-0 mb-3 flex flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isConfirmed && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {isFailed && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />}
            {isPending && <Loader2 className="w-5 h-5 text-amber-400 animate-spin shrink-0" />}
            <CardTitle className="text-base font-bold">{tx.title}</CardTitle>
          </div>
          {statusBadges[tx.status] || <Badge variant="default">{tx.status}</Badge>}
        </CardHeader>

        <CardContent className="p-0 space-y-3">
          <CardDescription className="text-xs text-slate-300">{tx.description}</CardDescription>

          {tx.hash && (
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Transaction Hash</span>
              <ExplorerLink hash={tx.hash} />
            </div>
          )}

          {tx.error && (
            <div className="bg-rose-950/40 p-3 rounded-xl border border-rose-800/50 text-xs text-rose-300">
              {tx.error}
            </div>
          )}
        </CardContent>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
        </div>

        {isFailed && tx.retryAction && <RetryButton onRetry={tx.retryAction} />}
      </div>
    </Card>
  );
}
