"use client";

import { useWalletStore } from "@/store/wallet-store";

export function useWallet() {
  const {
    address,
    publicKey,
    walletId,
    walletName,
    network,
    isConnected,
    isConnecting,
    error,
    balanceXlm,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  } = useWalletStore();

  return {
    address,
    publicKey,
    walletId,
    walletName,
    network,
    isConnected,
    isConnecting,
    error,
    balanceXlm,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  };
}
