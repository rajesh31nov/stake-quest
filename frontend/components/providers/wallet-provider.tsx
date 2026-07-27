"use client";

import React, { useEffect } from "react";
import { useWalletStore } from "@/store/wallet-store";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const setAddress = useWalletStore((s) => s.setAddress);
  const refreshBalance = useWalletStore((s) => s.refreshBalance);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAddress = localStorage.getItem("stakequest_connected_address");
      const savedWalletId = localStorage.getItem("stakequest_wallet_id");

      if (savedAddress && savedWalletId) {
        setAddress(savedAddress, savedWalletId);
        refreshBalance();
      }
    }
  }, [setAddress, refreshBalance]);

  return <>{children}</>;
}
