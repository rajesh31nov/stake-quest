import { ChallengeModel, ChallengeStatus } from "@/types/challenge";
import { TransactionCenterItem } from "@/store/transaction-store";
import { UserDashboardStats } from "@/types/analytics";
import { xlmToStroops, stroopsToXlm } from "@/utils/formatters";

export class AnalyticsService {
  /**
   * Aggregate challenge models and transaction items into UserDashboardStats
   */
  public computeDashboardStats(
    challenges: ChallengeModel[],
    userAddress: string | null,
    transactions: TransactionCenterItem[] = []
  ): UserDashboardStats {
    if (!challenges || challenges.length === 0) {
      return {
        totalChallengesCreated: 0,
        totalChallengesAccepted: 0,
        activeChallengesCount: 0,
        completedChallengesCount: 0,
        failedChallengesCount: 0,
        pendingChallengesCount: 0,
        expiredChallengesCount: 0,
        totalXlmStaked: "0.00",
        totalXlmEarned: "0.00",
        totalRewardsReleased: "0.00",
        totalRefundsReceived: "0.00",
        successRatePercentage: 0,
        completionRatePercentage: 0,
        successfulTransactions: transactions.filter((t) => t.status === "CONFIRMED").length,
        failedTransactions: transactions.filter((t) => t.status === "FAILED" || t.status === "EXPIRED").length,
        pendingTransactions: transactions.filter((t) => t.status === "PENDING" || t.status === "PROCESSING").length,
      };
    }

    const created = challenges.filter((c) => c.challenger === userAddress).length;
    const accepted = challenges.filter((c) => c.status !== ChallengeStatus.Created && c.status !== ChallengeStatus.Rejected && c.status !== ChallengeStatus.Cancelled).length;
    const active = challenges.filter((c) => c.status === ChallengeStatus.Active || c.status === ChallengeStatus.ProofSubmitted).length;
    const completed = challenges.filter((c) => c.status === ChallengeStatus.Completed).length;
    const failed = challenges.filter((c) => c.status === ChallengeStatus.ProofRejected).length;
    const pending = challenges.filter((c) => c.status === ChallengeStatus.Created).length;
    const expired = challenges.filter((c) => c.status === ChallengeStatus.Expired).length;

    let stakedStroops = 0n;
    let earnedStroops = 0n;
    let refundStroops = 0n;

    for (const c of challenges) {
      const amount = c.amountStroops;
      if (c.challenger === userAddress) {
        stakedStroops += amount;
      }
      if (c.participant === userAddress && c.status === ChallengeStatus.Completed) {
        earnedStroops += amount;
      }
      if (c.challenger === userAddress && (c.status === ChallengeStatus.Expired || c.status === ChallengeStatus.Cancelled || c.status === ChallengeStatus.Rejected)) {
        refundStroops += amount;
      }
    }

    const totalFinished = completed + failed + expired;
    const successRate = totalFinished > 0 ? Math.round((completed / totalFinished) * 100) : 0;
    const completionRate = challenges.length > 0 ? Math.round(((completed + active) / challenges.length) * 100) : 0;

    return {
      totalChallengesCreated: created,
      totalChallengesAccepted: accepted,
      activeChallengesCount: active,
      completedChallengesCount: completed,
      failedChallengesCount: failed,
      pendingChallengesCount: pending,
      expiredChallengesCount: expired,
      totalXlmStaked: stroopsToXlm(stakedStroops),
      totalXlmEarned: stroopsToXlm(earnedStroops),
      totalRewardsReleased: stroopsToXlm(earnedStroops),
      totalRefundsReceived: stroopsToXlm(refundStroops),
      successRatePercentage: successRate,
      completionRatePercentage: completionRate,
      successfulTransactions: transactions.filter((t) => t.status === "CONFIRMED").length,
      failedTransactions: transactions.filter((t) => t.status === "FAILED" || t.status === "EXPIRED").length,
      pendingTransactions: transactions.filter((t) => t.status === "PENDING" || t.status === "PROCESSING").length,
    };
  }
}

export const analyticsService = new AnalyticsService();
