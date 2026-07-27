export type EventCategory = "ALL" | "CREATION" | "PROOF" | "PAYOUT" | "ESCROW";

export interface SorobanContractEvent {
  id: string;
  contractId: string;
  topic: string;
  category: EventCategory;
  title: string;
  description: string;
  challengeId?: number;
  actorAddress?: string;
  amountXlm?: string;
  timestamp: number;
  ledger: number;
}
