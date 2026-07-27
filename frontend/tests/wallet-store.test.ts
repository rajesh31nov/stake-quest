import { describe, it, expect, beforeEach } from "vitest";
import { useWalletStore } from "@/store/wallet-store";

describe("WalletStore", () => {
  beforeEach(() => {
    useWalletStore.getState().disconnectWallet();
  });

  it("should initialize with disconnected state", () => {
    const state = useWalletStore.getState();
    expect(state.isConnected).toBe(false);
    expect(state.address).toBeNull();
    expect(state.balanceXlm).toBeNull();
  });

  it("should set address and connect state correctly", () => {
    const testAddress = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";
    useWalletStore.getState().setAddress(testAddress, "freighter");

    const state = useWalletStore.getState();
    expect(state.isConnected).toBe(true);
    expect(state.address).toBe(testAddress);
    expect(state.walletId).toBe("freighter");
  });

  it("should disconnect and clear state", () => {
    const testAddress = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";
    useWalletStore.getState().setAddress(testAddress, "freighter");
    useWalletStore.getState().disconnectWallet();

    const state = useWalletStore.getState();
    expect(state.isConnected).toBe(false);
    expect(state.address).toBeNull();
    expect(state.walletId).toBeNull();
  });
});
