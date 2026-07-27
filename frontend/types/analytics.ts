export interface UserDashboardStats {
  totalChallengesCreated: number;
  totalChallengesAccepted: number;
  activeChallengesCount: number;
  completedChallengesCount: number;
  failedChallengesCount: number;
  pendingChallengesCount: number;
  expiredChallengesCount: number;
  totalXlmStaked: string;
  totalXlmEarned: string;
  totalRewardsReleased: string;
  totalRefundsReceived: string;
  successRatePercentage: number;
  completionRatePercentage: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
}
