import { create } from "zustand";
import { WalletState, NetworkType } from "@/types/wallet";
import { stellarRpcService } from "@/services/stellar-rpc";
import { walletKitService } from "@/services/wallet-kit";

interface WalletStoreAction {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  setAddress: (address: string, walletId: string) => void;
  refreshBalance: () => Promise<void>;
  setNetwork: (network: NetworkType) => void;
  initAutoConnect: () => Promise<void>;
}

export const useWalletStore = create<WalletState & WalletStoreAction>((set, get) => ({
  address: null,
  publicKey: null,
  walletId: null,
  walletName: null,
  walletIcon: null,
  network: "TESTNET",
  isConnected: false,
  isConnecting: false,
  error: null,
  balanceXlm: null,

  connectWallet: async () => {
    set({ isConnecting: true, error: null });
    try {
      await walletKitService.openConnectModal(async (address, walletId) => {
        set({
          address,
          publicKey: address,
          walletId,
          isConnected: true,
          isConnecting: false,
          error: null,
        });

        if (typeof window !== "undefined") {
          localStorage.setItem("stakequest_connected_address", address);
          localStorage.setItem("stakequest_wallet_id", walletId);
        }

        await get().refreshBalance();
      });
    } catch (err: any) {
      set({
        isConnecting: false,
        error: err.message || "Failed to connect Freighter wallet.",
      });
    }
  },

  disconnectWallet: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("stakequest_connected_address");
      localStorage.removeItem("stakequest_wallet_id");
    }
    set({
      address: null,
      publicKey: null,
      walletId: null,
      isConnected: false,
      balanceXlm: null,
      error: null,
    });
  },

  setAddress: (address: string, walletId: string) => {
    set({
      address,
      publicKey: address,
      walletId,
      isConnected: true,
    });
    get().refreshBalance();
  },

  refreshBalance: async () => {
    const { address } = get();
    if (!address) return;
    try {
      const balance = await stellarRpcService.getAccountBalance(address);
      set({ balanceXlm: balance });
    } catch (err) {
      console.error("Failed to refresh balance:", err);
    }
  },

  setNetwork: (network: NetworkType) => {
    set({ network });
  },

  initAutoConnect: async () => {
    if (typeof window === "undefined") return;
    const savedAddress = localStorage.getItem("stakequest_connected_address");
    const savedWalletId = localStorage.getItem("stakequest_wallet_id") || "freighter";

    if (savedAddress && savedAddress.startsWith("G")) {
      set({
        address: savedAddress,
        publicKey: savedAddress,
        walletId: savedWalletId,
        isConnected: true,
      });
      await get().refreshBalance();
    }
  },
}));
