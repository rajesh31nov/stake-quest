"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, Link as LinkIcon, FileText, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToastBanner } from "@/components/ui/toast";
import { useSubmitProof } from "@/hooks/use-challenge-actions";

const proofSchema = z.object({
  proofUrl: z
    .string()
    .min(1, "Proof URL is required.")
    .url("Must be a valid web link (e.g., https://github.com/user/repo)"),
  notes: z
    .string()
    .min(10, "Please provide at least 10 characters describing your proof.")
    .max(500, "Notes cannot exceed 500 characters."),
});

type ProofFormData = z.infer<typeof proofSchema>;

interface SubmitProofFormProps {
  challengeId: number;
  challengeTitle: string;
}

export function SubmitProofForm({ challengeId, challengeTitle }: SubmitProofFormProps) {
  const { submitProof, isSubmitting, error, isSuccess } = useSubmitProof();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProofFormData>({
    resolver: zodResolver(proofSchema),
    defaultValues: {
      proofUrl: "",
      notes: "",
    },
  });

  const onSubmit = async (data: ProofFormData) => {
    await submitProof({
      challengeId,
      proofUrl: data.proofUrl,
      notes: data.notes,
    });
  };

  return (
    <Card className="max-w-2xl mx-auto border-slate-800 bg-slate-900/80 shadow-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>Submit Challenge Proof</CardTitle>
            <CardDescription>
              Submit evidence for &quot;{challengeTitle}&quot; for Challenger verification.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <ToastBanner type="error" title="Submission Error" message={error} className="mb-6" />
        )}

        {isSuccess && (
          <ToastBanner
            type="success"
            title="Proof Submitted!"
            message="Your proof has been recorded on the Soroban blockchain. The Challenger will review it shortly."
            className="mb-6"
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Proof URL (GitHub, Vercel, Strava, LeetCode, etc.) *
            </label>
            <div className="relative">
              <Input
                placeholder="https://github.com/user/project"
                {...register("proofUrl")}
              />
              <LinkIcon className="w-4 h-4 text-cyan-400 absolute right-3.5 top-3.5" />
            </div>
            {errors.proofUrl && (
              <p className="text-xs text-rose-400 mt-1">{errors.proofUrl.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Completion Description & Notes *
            </label>
            <Textarea
              placeholder="Describe what you accomplished and how the Challenger can verify it..."
              rows={4}
              {...register("notes")}
            />
            {errors.notes && (
              <p className="text-xs text-rose-400 mt-1">{errors.notes.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base font-bold gap-2 bg-cyan-600 hover:bg-cyan-500 text-white"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting Proof to Soroban...
              </>
            ) : (
              <>
                Submit Proof for Verification
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
