"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateChallengeInput } from "@/types/challenge";
import { challengeContractService } from "@/services/challenge-contract";
import { useWalletStore } from "@/store/wallet-store";
import { useTransactionStore } from "@/store/transaction-store";
import { parseStellarError } from "@/utils/errors";

export function useCreateChallenge() {
  const queryClient = useQueryClient();
  const address = useWalletStore((s) => s.address);
  const addTransaction = useTransactionStore((s) => s.addTransaction);
  const updateTransactionStatus = useTransactionStore((s) => s.updateTransactionStatus);

  const mutation = useMutation({
    mutationFn: async (input: CreateChallengeInput) => {
      if (!address) {
        throw new Error("Please connect your Stellar wallet first.");
      }

      const txId = `tx_${Date.now()}`;
      addTransaction({
        id: txId,
        title: "Create Challenge",
        description: `Staking ${input.amountXlm} XLM for "${input.title}"`,
        status: "PROCESSING",
      });

      try {
        const result = await challengeContractService.createChallenge(address, input);
        updateTransactionStatus(txId, "CONFIRMED", result.txHash);
        return result;
      } catch (err: any) {
        const humanError = parseStellarError(err);
        updateTransactionStatus(txId, "FAILED", undefined, humanError);
        throw new Error(humanError);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      useWalletStore.getState().refreshBalance();
    },
  });

  return {
    createChallenge: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error ? (mutation.error as Error).message : null,
    isSuccess: mutation.isSuccess,
  };
}
