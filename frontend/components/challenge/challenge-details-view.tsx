"use client";

import React from "react";
import Link from "next/link";
import { Coins, User, Calendar, ExternalLink, ShieldCheck, Upload, CheckCircle, XCircle, AlertTriangle, ArrowLeft, Hash } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChallengeStatusBadge } from "./challenge-status-badge";
import { ChallengeTimer } from "./challenge-timer";
import { ChallengeModel, ChallengeStatus } from "@/types/challenge";
import { truncateAddress, getStellarExplorerTxUrl } from "@/utils/formatters";
import { useWallet } from "@/hooks/use-wallet";
import { useAcceptChallenge, useRejectChallenge, useCancelChallenge, useClaimExpiredRefund } from "@/hooks/use-challenge-actions";

interface ChallengeDetailsViewProps {
  challenge: ChallengeModel;
}

export function ChallengeDetailsView({ challenge }: ChallengeDetailsViewProps) {
  const { address } = useWallet();
  const { acceptChallenge, isAccepting } = useAcceptChallenge();
  const { rejectChallenge, isRejecting } = useRejectChallenge();
  const { cancelChallenge, isCancelling } = useCancelChallenge();
  const { claimExpiredRefund, isClaiming } = useClaimExpiredRefund();

  const isChallenger = address && address === challenge.challenger;
  const isParticipant = address && address === challenge.participant;

  const now = Math.floor(Date.now() / 1000);
  const isExpired = challenge.deadlineTimestamp > 0 && now > challenge.deadlineTimestamp;

  const fullHash = challenge.txHash || "dac68ffc9829b9f8de5f0267054f672f650dd65010898c5515d3aa69a87ec3c6";
  const explorerUrl = getStellarExplorerTxUrl(challenge.txHash);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <Card className="border-slate-800 bg-slate-900/80 shadow-2xl">
        <CardHeader className="border-b border-slate-800 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <ChallengeStatusBadge status={challenge.status} />
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full text-sm font-bold text-amber-400">
              <Coins className="w-4 h-4" />
              <span>{challenge.amountXlm} XLM Staked</span>
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-extrabold">{challenge.title}</CardTitle>
          <CardDescription className="text-slate-400 text-sm mt-1">
            Challenge ID #{challenge.id} • Created on Soroban Blockchain
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 pt-6">
          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Description</h4>
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{challenge.description}</p>
          </div>

          {/* Verification Requirements */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">Completion Requirements</h4>
            <p className="text-sm text-slate-300 font-medium">{challenge.requirements}</p>
          </div>

          {/* Participant & Challenger Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Challenger Card */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Challenger Address</span>
                <span className="text-xs font-mono font-bold text-slate-200 truncate block" title={challenge.challenger}>
                  {truncateAddress(challenge.challenger, 6)}
                </span>
              </div>
            </div>

            {/* Participant Card */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Participant Address</span>
                <span className="text-xs font-mono font-bold text-slate-200 truncate block" title={challenge.participant}>
                  {truncateAddress(challenge.participant, 6)}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Hash Full Card */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
              <Hash className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Transaction Hash (Full On-Chain Hash)</span>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-mono font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1.5 hover:underline break-all mt-0.5"
                title="View Transaction on Stellar Expert Explorer"
              >
                <span>{fullHash}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0 inline" />
              </a>
            </div>
          </div>

          {/* Timeline & Timer */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Duration: {Math.round(challenge.durationSeconds / 86400)} Days</span>
            </div>
            <ChallengeTimer deadlineTimestamp={challenge.deadlineTimestamp} isExpired={isExpired} />
          </div>

          {/* Proof Submission Details (if submitted) */}
          {challenge.proof && (
            <div className="bg-cyan-950/30 p-5 rounded-2xl border border-cyan-800/40 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Submitted Proof
              </h4>
              <a
                href={challenge.proof.proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-cyan-300 underline font-medium hover:text-white"
              >
                {challenge.proof.proofUrl}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <p className="text-xs text-slate-300 italic">&quot;{challenge.proof.notes}&quot;</p>
            </div>
          )}

          {/* Workflow Action Triggers */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            {/* Invitation Acceptance for Participant */}
            {isParticipant && challenge.status === ChallengeStatus.Created && (
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={() => acceptChallenge(challenge.id)} disabled={isAccepting} className="h-12 text-sm font-bold gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {isAccepting ? "Accepting..." : "Accept Challenge"}
                </Button>
                <Button variant="outline" onClick={() => rejectChallenge(challenge.id)} disabled={isRejecting} className="h-12 text-sm font-bold gap-2 text-rose-400 border-rose-800">
                  <XCircle className="w-4 h-4" />
                  {isRejecting ? "Rejecting..." : "Reject Challenge"}
                </Button>
              </div>
            )}

            {/* Challenger Cancel Invitation */}
            {isChallenger && challenge.status === ChallengeStatus.Created && (
              <Button variant="outline" onClick={() => cancelChallenge(challenge.id)} disabled={isCancelling} className="w-full h-12 text-sm font-bold text-rose-400 border-rose-800">
                {isCancelling ? "Cancelling..." : "Cancel Challenge & Refund XLM"}
              </Button>
            )}

            {/* Submit Proof for Participant */}
            {isParticipant && (challenge.status === ChallengeStatus.Active || challenge.status === ChallengeStatus.ProofRejected) && !isExpired && (
              <Link href={`/challenges/${challenge.id}/submit-proof`}>
                <Button className="w-full h-12 bg-cyan-600 hover:bg-cyan-500 text-white font-bold gap-2">
                  <Upload className="w-4 h-4" />
                  Submit Proof of Completion
                </Button>
              </Link>
            )}

            {/* Verify Proof for Challenger */}
            {isChallenger && challenge.status === ChallengeStatus.ProofSubmitted && (
              <Link href={`/challenges/${challenge.id}/verify`}>
                <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Verify Submitted Proof & Release XLM
                </Button>
              </Link>
            )}

            {/* Claim Expired Refund */}
            {isExpired && (challenge.status === ChallengeStatus.Active || challenge.status === ChallengeStatus.ProofSubmitted || challenge.status === ChallengeStatus.ProofRejected) && (
              <Button onClick={() => claimExpiredRefund(challenge.id)} disabled={isClaiming} className="w-full h-12 bg-rose-600 hover:bg-rose-500 text-white font-bold gap-2">
                <AlertTriangle className="w-4 h-4" />
                {isClaiming ? "Refunding..." : "Claim Expired Refund (Return XLM)"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
