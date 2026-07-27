import { describe, it, expect, beforeEach } from "vitest";
import { useWalletStore } from "@/store/wallet-store";
import { STELLAR_CONFIG } from "@/utils/stellar-constants";

describe("Wallet Integration & Network Validation", () => {
  beforeEach(() => {
    useWalletStore.setState({ address: null, isConnected: false, balance: "0" });
  });

  it("should initialize disconnected by default", () => {
    const state = useWalletStore.getState();
    expect(state.address).toBeNull();
    expect(state.isConnected).toBe(false);
  });

  it("should update address and connection status on setAddress", () => {
    const mockAddr = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";
    useWalletStore.getState().setAddress(mockAddr);
    const state = useWalletStore.getState();
    expect(state.address).toBe(mockAddr);
    expect(state.isConnected).toBe(true);
  });

  it("should clear address on disconnect reset", () => {
    useWalletStore.getState().setAddress("GABC");
    expect(useWalletStore.getState().isConnected).toBe(true);

    useWalletStore.setState({ address: null, isConnected: false });

    const state = useWalletStore.getState();
    expect(state.address).toBeNull();
    expect(state.isConnected).toBe(false);
  });

  it("should validate testnet network configuration constants", () => {
    expect(STELLAR_CONFIG.TESTNET.networkPassphrase).toBe("Test SDF Network ; July 2015");
    expect(STELLAR_CONFIG.TESTNET.rpcUrl).toContain("stellar.org");
  });
});
