import { describe, it, expect, beforeEach } from "vitest";
import { useTransactionStore } from "@/store/transaction-store";

describe("Transaction Center Store", () => {
  beforeEach(() => {
    useTransactionStore.getState().clearAll();
  });

  it("should add a new transaction and update status", () => {
    const txId = "tx_test_100";
    useTransactionStore.getState().addTransaction({
      id: txId,
      title: "Test Transaction",
      description: "Testing Soroban deposit",
      status: "PENDING",
    });

    let store = useTransactionStore.getState();
    expect(store.transactions.length).toBe(1);
    expect(store.transactions[0].status).toBe("PENDING");

    useTransactionStore.getState().updateStatus(txId, "CONFIRMED", "hash_abc_123");
    store = useTransactionStore.getState();
    expect(store.transactions[0].status).toBe("CONFIRMED");
    expect(store.transactions[0].hash).toBe("hash_abc_123");
  });
});
