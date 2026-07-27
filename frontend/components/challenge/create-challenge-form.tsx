"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { StrKey } from "@stellar/stellar-sdk";
import { Trophy, Clock, Coins, UserCheck, AlertTriangle, ArrowRight } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToastBanner } from "@/components/ui/toast";
import { useWallet } from "@/hooks/use-wallet";
import { useCreateChallenge } from "@/hooks/use-create-challenge";

const challengeSchema = z.object({
  participantAddress: z
    .string()
    .min(1, "Participant address is required.")
    .refine((val) => StrKey.isValidEd25519PublicKey(val), {
      message: "Invalid Stellar G... public key address.",
    }),
  amountXlm: z
    .string()
    .min(1, "Amount is required.")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Stake amount must be a number greater than 0 XLM.",
    }),
  durationDays: z
    .number({ invalid_type_error: "Duration is required." })
    .min(1, "Minimum duration is 1 day.")
    .max(90, "Maximum duration is 90 days."),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters.")
    .max(80, "Title cannot exceed 80 characters."),
  description: z
    .string()
    .min(15, "Description must be at least 15 characters.")
    .max(500, "Description cannot exceed 500 characters."),
  requirements: z
    .string()
    .min(10, "Completion requirements must be specified.")
    .max(300, "Requirements cannot exceed 300 characters."),
});

type ChallengeFormData = z.infer<typeof challengeSchema>;

export function CreateChallengeForm() {
  const { address, isConnected, connectWallet } = useWallet();
  const { createChallenge, isCreating, error, isSuccess } = useCreateChallenge();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      participantAddress: "",
      amountXlm: "10",
      durationDays: 14,
      title: "",
      description: "",
      requirements: "",
    },
  });

  const participantWatch = watch("participantAddress");
  const isSelf = isConnected && address && participantWatch.trim() === address;

  const onSubmit = async (data: ChallengeFormData) => {
    if (isSelf) return;
    await createChallenge(data);
  };

  return (
    <Card className="max-w-2xl mx-auto border-slate-800 bg-slate-900/80 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>Create New Challenge</CardTitle>
            <CardDescription>
              Lock XLM collateral into Soroban Escrow to hold your partner accountable.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <ToastBanner
            type="error"
            title="Challenge Creation Failed"
            message={error}
            className="mb-6"
          />
        )}

        {isSuccess && (
          <ToastBanner
            type="success"
            title="Challenge Created Successfully!"
            message="Your XLM collateral has been locked in Soroban escrow. The participant can now accept the challenge."
            className="mb-6"
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Challenge Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Challenge Title *
            </label>
            <Input
              placeholder="e.g. Complete 100 LeetCode Problems in 30 Days"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-rose-400 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Participant Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Participant Stellar Address (G...) *
            </label>
            <div className="relative">
              <Input
                placeholder="G..."
                {...register("participantAddress")}
                className={isSelf ? "border-rose-500 focus:border-rose-500" : ""}
              />
              <UserCheck className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
            </div>
            {errors.participantAddress && (
              <p className="text-xs text-rose-400 mt-1">
                {errors.participantAddress.message}
              </p>
            )}
            {isSelf && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>You cannot challenge your own address.</span>
              </div>
            )}
          </div>

          {/* Grid: Stake Amount & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Amount XLM */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Staked Collateral (XLM) *
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  placeholder="10"
                  {...register("amountXlm")}
                />
                <Coins className="w-4 h-4 text-amber-400 absolute right-3.5 top-3.5" />
              </div>
              {errors.amountXlm && (
                <p className="text-xs text-rose-400 mt-1">
                  {errors.amountXlm.message}
                </p>
              )}
            </div>

            {/* Duration Days */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Duration (Days) *
              </label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="14"
                  {...register("durationDays", { valueAsNumber: true })}
                />
                <Clock className="w-4 h-4 text-cyan-400 absolute right-3.5 top-3.5" />
              </div>
              {errors.durationDays && (
                <p className="text-xs text-rose-400 mt-1">
                  {errors.durationDays.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Detailed Description *
            </label>
            <Textarea
              placeholder="Describe the goals, motivation, and scope of this commitment..."
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-rose-400 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Verification Requirements */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Proof Requirements *
            </label>
            <Input
              placeholder="e.g. Public GitHub URL, Strava run link, or live site link"
              {...register("requirements")}
            />
            {errors.requirements && (
              <p className="text-xs text-rose-400 mt-1">
                {errors.requirements.message}
              </p>
            )}
          </div>

          {/* Action Submit Button */}
          {!isConnected ? (
            <Button
              type="button"
              onClick={connectWallet}
              className="w-full h-12 text-base font-bold gap-2"
            >
              Connect Wallet to Lock Funds
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isCreating || Boolean(isSelf)}
              className="w-full h-12 text-base font-bold gap-2"
            >
              {isCreating ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Staking XLM in Escrow...
                </>
              ) : (
                <>
                  Lock XLM & Create Challenge
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
