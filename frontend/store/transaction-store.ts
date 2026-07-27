import { create } from "zustand";

export type FullTransactionStatus =
  | "PENDING"
  | "PREPARING"
  | "SIGNING"
  | "SUBMITTED"
  | "PROCESSING"
  | "CONFIRMED"
  | "FAILED"
  | "EXPIRED"
  | "CANCELLED";

export interface TransactionCenterItem {
  id: string;
  hash?: string;
  title: string;
  description: string;
  status: FullTransactionStatus;
  timestamp: number;
  error?: string;
  explorerUrl?: string;
  retryAction?: () => Promise<void>;
}

interface TransactionStoreState {
  transactions: TransactionCenterItem[];
  addTransaction: (tx: Omit<TransactionCenterItem, "timestamp">) => void;
  updateStatus: (
    id: string,
    status: FullTransactionStatus,
    hash?: string,
    error?: string
  ) => void;
  updateTransactionStatus: (
    id: string,
    status: FullTransactionStatus,
    hash?: string,
    error?: string
  ) => void;
  setRetryAction: (id: string, action: () => Promise<void>) => void;
  removeTransaction: (id: string) => void;
  clearAll: () => void;
}

export const useTransactionStore = create<TransactionStoreState>((set, get) => ({
  transactions: [],

  addTransaction: (tx) =>
    set((state) => ({
      transactions: [
        {
          ...tx,
          timestamp: Date.now(),
        },
        ...state.transactions.filter((t) => t.id !== tx.id),
      ],
    })),

  updateStatus: (id, status, hash, error) =>
    set((state) => ({
      transactions: state.transactions.map((tx) =>
        tx.id === id
          ? {
              ...tx,
              status,
              ...(hash ? { hash } : {}),
              ...(error ? { error } : {}),
            }
          : tx
      ),
    })),

  updateTransactionStatus: (id, status, hash, error) => {
    get().updateStatus(id, status, hash, error);
  },

  setRetryAction: (id, retryAction) =>
    set((state) => ({
      transactions: state.transactions.map((tx) =>
        tx.id === id ? { ...tx, retryAction } : tx
      ),
    })),

  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),

  clearAll: () => set({ transactions: [] }),
}));
