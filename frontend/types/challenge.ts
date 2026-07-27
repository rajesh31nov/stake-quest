export enum ChallengeStatus {
  Created = "Created",
  Active = "Active",
  ProofSubmitted = "ProofSubmitted",
  Completed = "Completed",
  ProofRejected = "ProofRejected",
  Cancelled = "Cancelled",
  Rejected = "Rejected",
  Expired = "Expired",
}

export interface ChallengeProof {
  proofUrl: string;
  notes: string;
  submittedAt: number;
}

export interface ChallengeModel {
  id: number;
  challenger: string;
  participant: string;
  amountXlm: string;
  amountStroops: bigint;
  durationSeconds: number;
  deadlineTimestamp: number;
  status: ChallengeStatus;
  title: string;
  description: string;
  requirements: string;
  proof: ChallengeProof | null;
  createdAt: number;
}

export interface CreateChallengeInput {
  participantAddress: string;
  amountXlm: string;
  durationDays: number;
  title: string;
  description: string;
  requirements: string;
}
