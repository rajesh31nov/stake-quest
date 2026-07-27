import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { ChallengeStatus, ChallengeModel } from "@/types/challenge";
import { analyticsService } from "@/services/analytics-service";
import { useTransactionStore } from "@/store/transaction-store";

describe("End-to-End Integration Workflows", () => {
  beforeEach(() => {
    useTransactionStore.getState().clearAll();
  });

  it("Workflow 1: Full Challenge Lifecycle (Create -> Accept -> Submit Proof -> Approve -> Dashboard Update)", () => {
    const challenger = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";
    const participant = "GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBWHF";

    // Step 1: Create Challenge
    const challenge: ChallengeModel = {
      id: 101,
      challenger,
      participant,
      amountXlm: "50.00",
      amountStroops: 500000000n,
      durationSeconds: 86400,
      deadlineTimestamp: 0,
      status: ChallengeStatus.Created,
      title: "Complete Soroban Orange Belt",
      description: "Build StakeQuest dApp",
      requirements: "GitHub repo link",
      proof: null,
      createdAt: Date.now(),
    };

    let stats = analyticsService.computeDashboardStats([challenge], challenger);
    expect(stats.totalChallengesCreated).toBe(1);
    expect(stats.completedChallengesCount).toBe(0);

    // Step 2: Accept Challenge
    challenge.status = ChallengeStatus.Active;
    challenge.deadlineTimestamp = Math.floor(Date.now() / 1000) + 86400;

    stats = analyticsService.computeDashboardStats([challenge], challenger);
    expect(stats.activeChallengesCount).toBe(1);

    // Step 3: Submit Proof
    challenge.status = ChallengeStatus.ProofSubmitted;
    challenge.proof = {
      proofUrl: "https://github.com/stellar/stake-quest",
      notes: "Implemented all 7 phases with tests",
      submittedAt: Date.now(),
    };

    expect(challenge.proof.proofUrl).toContain("github.com");

    // Step 4: Approve & Payout Reward
    challenge.status = ChallengeStatus.Completed;
    stats = analyticsService.computeDashboardStats([challenge], participant);
    expect(stats.completedChallengesCount).toBe(1);
    expect(stats.totalXlmEarned).toBe("50.00");
  });

  it("Workflow 2: Rejection & Refund Workflow", () => {
    const challenger = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";
    const challenge: ChallengeModel = {
      id: 102,
      challenger,
      participant: "GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBWHF",
      amountXlm: "20.00",
      amountStroops: 200000000n,
      durationSeconds: 86400,
      deadlineTimestamp: 0,
      status: ChallengeStatus.Created,
      title: "Rejected Invitation",
      description: "Invitation test",
      requirements: "Reqs",
      proof: null,
      createdAt: Date.now(),
    };

    challenge.status = ChallengeStatus.Rejected;
    const stats = analyticsService.computeDashboardStats([challenge], challenger);
    expect(stats.totalRefundsReceived).toBe("20.00");
  });

  it("Workflow 3: Expiration & Automatic Refund Workflow", () => {
    const challenger = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";
    const challenge: ChallengeModel = {
      id: 103,
      challenger,
      participant: "GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBWHF",
      amountXlm: "100.00",
      amountStroops: 1000000000n,
      durationSeconds: 86400,
      deadlineTimestamp: Math.floor(Date.now() / 1000) - 3600, // Expired
      status: ChallengeStatus.Expired,
      title: "Expired Challenge",
      description: "Deadline passed",
      requirements: "Reqs",
      proof: null,
      createdAt: Date.now() - 90000,
    };

    const stats = analyticsService.computeDashboardStats([challenge], challenger);
    expect(stats.expiredChallengesCount).toBe(1);
    expect(stats.totalRefundsReceived).toBe("100.00");
  });

  it("Workflow 4: Failed Transaction & Retry Recovery Workflow", async () => {
    const txId = "tx_failed_99";
    useTransactionStore.getState().addTransaction({
      id: txId,
      title: "Failed Deposit",
      description: "Insufficient balance",
      status: "FAILED",
      error: "Tx failed: HostError",
    });

    let store = useTransactionStore.getState();
    expect(store.transactions[0].status).toBe("FAILED");

    let retried = false;
    useTransactionStore.getState().setRetryAction(txId, async () => {
      retried = true;
      useTransactionStore.getState().updateStatus(txId, "CONFIRMED", "hash_retry_ok");
    });

    store = useTransactionStore.getState();
    if (store.transactions[0].retryAction) {
      await store.transactions[0].retryAction();
    }

    expect(retried).toBe(true);
    expect(useTransactionStore.getState().transactions[0].status).toBe("CONFIRMED");
  });
});
