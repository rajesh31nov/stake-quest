export type TransactionStatus = "PENDING" | "PROCESSING" | "CONFIRMED" | "FAILED";

export interface TransactionRecord {
  id: string;
  hash?: string;
  title: string;
  description: string;
  status: TransactionStatus;
  timestamp: number;
  error?: string;
  explorerUrl?: string;
  retryAction?: () => Promise<void>;
}
