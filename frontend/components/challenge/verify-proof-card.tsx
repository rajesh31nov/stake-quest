"use client";

import React from "react";
import { ExternalLink, CheckCircle, XCircle, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToastBanner } from "@/components/ui/toast";
import { ChallengeModel } from "@/types/challenge";
import { useResolveChallenge } from "@/hooks/use-challenge-actions";

interface VerifyProofCardProps {
  challenge: ChallengeModel;
}

export function VerifyProofCard({ challenge }: VerifyProofCardProps) {
  const { resolveChallenge, isResolving, error, isSuccess } = useResolveChallenge();

  if (!challenge.proof) {
    return (
      <Card className="border-slate-800 bg-slate-900/60 p-6 text-center text-slate-400">
        No proof submitted yet.
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto border-slate-800 bg-slate-900/80 shadow-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>Verify Submitted Proof</CardTitle>
            <CardDescription>
              Review the evidence submitted for &quot;{challenge.title}&quot;.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && <ToastBanner type="error" title="Verification Error" message={error} />}
        {isSuccess && (
          <ToastBanner
            type="success"
            title="Resolution Completed"
            message="Your verification decision has been submitted to the Soroban contract."
          />
        )}

        {/* Proof Link Card */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Submitted Proof Link</span>
          <div>
            <a
              href={challenge.proof.proofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium text-sm underline break-all"
            >
              {challenge.proof.proofUrl}
              <ExternalLink className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>

        {/* Proof Notes */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Participant Notes</span>
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{challenge.proof.notes}</p>
        </div>

        {/* Verification Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <Button
            onClick={() => resolveChallenge({ challengeId: challenge.id, approve: true })}
            disabled={isResolving}
            className="h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Approve & Release {challenge.amountXlm} XLM
          </Button>

          <Button
            variant="outline"
            onClick={() => resolveChallenge({ challengeId: challenge.id, approve: false })}
            disabled={isResolving}
            className="h-12 border-rose-800 text-rose-400 hover:bg-rose-950 font-bold gap-2"
          >
            <XCircle className="w-5 h-5" />
            Reject Proof
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
