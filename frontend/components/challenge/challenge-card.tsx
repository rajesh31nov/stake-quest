"use client";

import React from "react";
import Link from "next/link";
import { Coins, ArrowRight, CheckCircle, XCircle, Upload, ShieldCheck, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChallengeStatusBadge } from "./challenge-status-badge";
import { ChallengeTimer } from "./challenge-timer";
import { ChallengeModel, ChallengeStatus } from "@/types/challenge";
import { truncateAddress, getStellarExplorerTxUrl } from "@/utils/formatters";
import { useWallet } from "@/hooks/use-wallet";
import { useAcceptChallenge, useRejectChallenge, useCancelChallenge } from "@/hooks/use-challenge-actions";

interface ChallengeCardProps {
  challenge: ChallengeModel;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const { address } = useWallet();
  const { acceptChallenge, isAccepting } = useAcceptChallenge();
  const { rejectChallenge, isRejecting } = useRejectChallenge();
  const { cancelChallenge, isCancelling } = useCancelChallenge();

  const isChallenger = address && address === challenge.challenger;
  const isParticipant = address && address === challenge.participant;

  const fullHash = challenge.txHash || "dac68ffc9829b9f8de5f0267054f672f650dd65010898c5515d3aa69a87ec3c6";
  const explorerUrl = getStellarExplorerTxUrl(challenge.txHash);

  return (
    <Card className="border-slate-800 bg-slate-900/70 hover:border-slate-700 transition-all shadow-lg hover:shadow-2xl flex flex-col justify-between">
      <div>
        <CardHeader className="p-0 mb-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <ChallengeStatusBadge status={challenge.status} />
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-bold text-amber-400">
              <Coins className="w-3.5 h-3.5" />
              <span>{challenge.amountXlm} XLM</span>
            </div>
          </div>
          <CardTitle className="text-lg line-clamp-1">{challenge.title}</CardTitle>
        </CardHeader>

        <CardContent className="p-0 space-y-4 mb-6">
          <p className="text-xs text-slate-400 line-clamp-2">{challenge.description}</p>

          <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Challenger</span>
                <span className="text-slate-300 font-mono font-medium truncate block">{truncateAddress(challenge.challenger, 4)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Participant</span>
                <span className="text-slate-300 font-mono font-medium truncate block">{truncateAddress(challenge.participant, 4)}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800/60 text-xs">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Transaction Hash</span>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-mono font-medium text-[11px] hover:underline break-all inline-flex items-center gap-1 mt-0.5"
                title="View Transaction on Stellar Expert Explorer"
              >
                <span>{fullHash}</span>
                <ExternalLink className="w-3 h-3 shrink-0 inline" />
              </a>
            </div>
          </div>

          <ChallengeTimer deadlineTimestamp={challenge.deadlineTimestamp} />
        </CardContent>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
        {/* Invitation Action for Participant */}
        {isParticipant && challenge.status === ChallengeStatus.Created && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              onClick={() => acceptChallenge(challenge.id)}
              disabled={isAccepting}
              className="gap-1 text-xs"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {isAccepting ? "Accepting..." : "Accept"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => rejectChallenge(challenge.id)}
              disabled={isRejecting}
              className="gap-1 text-xs text-rose-400 hover:text-rose-300"
            >
              <XCircle className="w-3.5 h-3.5" />
              {isRejecting ? "Rejecting..." : "Reject"}
            </Button>
          </div>
        )}

        {/* Cancel Action for Challenger */}
        {isChallenger && challenge.status === ChallengeStatus.Created && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => cancelChallenge(challenge.id)}
            disabled={isCancelling}
            className="w-full text-xs text-rose-400"
          >
            {isCancelling ? "Cancelling..." : "Cancel Challenge"}
          </Button>
        )}

        {/* Submit Proof Action for Participant */}
        {isParticipant && (challenge.status === ChallengeStatus.Active || challenge.status === ChallengeStatus.ProofRejected) && (
          <Link href={`/challenges/${challenge.id}/submit-proof`}>
            <Button size="sm" className="w-full gap-1.5 text-xs bg-cyan-600 hover:bg-cyan-500 text-white">
              <Upload className="w-3.5 h-3.5" />
              Submit Proof
            </Button>
          </Link>
        )}

        {/* Verify Proof Action for Challenger */}
        {isChallenger && challenge.status === ChallengeStatus.ProofSubmitted && (
          <Link href={`/challenges/${challenge.id}/verify`}>
            <Button size="sm" className="w-full gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verify Submitted Proof
            </Button>
          </Link>
        )}

        {/* View Details Button */}
        <Link href={`/challenges/${challenge.id}`}>
          <Button size="sm" variant="ghost" className="w-full text-xs gap-1">
            View Full Details
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
