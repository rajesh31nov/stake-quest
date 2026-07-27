import { describe, it, expect } from "vitest";
import { analyticsService } from "@/services/analytics-service";
import { ChallengeModel, ChallengeStatus } from "@/types/challenge";

describe("Analytics Service Calculations", () => {
  it("should calculate correct completion and success rates for empty challenges", () => {
    const stats = analyticsService.computeDashboardStats([], "GABC");
    expect(stats.totalChallengesCreated).toBe(0);
    expect(stats.successRatePercentage).toBe(0);
    expect(stats.totalXlmStaked).toBe("0.00");
  });

  it("should compute staked and earned XLM totals accurately", () => {
    const userAddr = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";
    const mockChallenges: ChallengeModel[] = [
      {
        id: 1,
        challenger: userAddr,
        participant: "GBBB",
        amountXlm: "10.00",
        amountStroops: 100000000n,
        durationSeconds: 86400,
        deadlineTimestamp: 0,
        status: ChallengeStatus.Completed,
        title: "Test 1",
        description: "Desc",
        requirements: "Reqs",
        proof: null,
        createdAt: Date.now(),
      },
      {
        id: 2,
        challenger: userAddr,
        participant: "GBBB",
        amountXlm: "20.00",
        amountStroops: 200000000n,
        durationSeconds: 86400,
        deadlineTimestamp: 0,
        status: ChallengeStatus.ProofRejected,
        title: "Test 2",
        description: "Desc",
        requirements: "Reqs",
        proof: null,
        createdAt: Date.now(),
      },
    ];

    const stats = analyticsService.computeDashboardStats(mockChallenges, userAddr);
    expect(stats.totalChallengesCreated).toBe(2);
    expect(stats.completedChallengesCount).toBe(1);
    expect(stats.failedChallengesCount).toBe(1);
    expect(stats.successRatePercentage).toBe(50); // 1 completed out of 2 finished
    expect(stats.totalXlmStaked).toBe("30.00");
  });
});
