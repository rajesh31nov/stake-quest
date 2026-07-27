import React from "react";
import Link from "next/link";
import { Zap, Coins, Upload, CheckCircle2, Lock, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SorobanContractEvent } from "@/types/event";

interface ActivityCardProps {
  event: SorobanContractEvent;
}

export function ActivityCard({ event }: ActivityCardProps) {
  const icons = {
    CREATION: <Zap className="w-4 h-4 text-amber-400" />,
    PROOF: <Upload className="w-4 h-4 text-cyan-400" />,
    PAYOUT: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    ESCROW: <Lock className="w-4 h-4 text-purple-400" />,
    ALL: <Coins className="w-4 h-4 text-amber-400" />,
  };

  return (
    <Card className="border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        <CardHeader className="p-0 mb-3 flex flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center">
              {icons[event.category] || icons.ALL}
            </div>
            <CardTitle className="text-sm font-bold">{event.title}</CardTitle>
          </div>
          <Badge variant="default">{event.category}</Badge>
        </CardHeader>

        <CardDescription className="text-xs text-slate-300 leading-relaxed mb-3">
          {event.description}
        </CardDescription>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Ledger #{event.ledger}</span>
        {event.challengeId && (
          <Link
            href={`/challenges/${event.challengeId}`}
            className="inline-flex items-center gap-1 text-amber-400 hover:underline font-semibold"
          >
            View Challenge #{event.challengeId}
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </Card>
  );
}
