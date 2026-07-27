import { create } from "zustand";
import { TransactionRecord, TransactionStatus } from "@/types/stellar";

interface TransactionStoreState {
  transactions: TransactionRecord[];
  addTransaction: (tx: Omit<TransactionRecord, "timestamp">) => void;
  updateTransactionStatus: (
    id: string,
    status: TransactionStatus,
    hash?: string,
    error?: string
  ) => void;
  clearTransactions: () => void;
}

export const useTransactionStore = create<TransactionStoreState>((set) => ({
  transactions: [],

  addTransaction: (tx) =>
    set((state) => ({
      transactions: [
        {
          ...tx,
          timestamp: Date.now(),
        },
        ...state.transactions,
      ],
    })),

  updateTransactionStatus: (id, status, hash, error) =>
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

  clearTransactions: () => set({ transactions: [] }),
}));
