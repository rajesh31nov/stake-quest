"use client";

import React, { useEffect, useState } from "react";
import { Wallet, LogOut, RefreshCw, ChevronDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { useWalletStore } from "@/store/wallet-store";
import { truncateAddress } from "@/utils/formatters";

export function WalletButton() {
  const {
    address,
    isConnected,
    isConnecting,
    error,
    balanceXlm,
    network,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  } = useWallet();

  const initAutoConnect = useWalletStore((s) => s.initAutoConnect);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  useEffect(() => {
    initAutoConnect();
  }, [initAutoConnect]);

  useEffect(() => {
    if (error) {
      setShowErrorAlert(true);
    }
  }, [error]);

  const handleConnect = async () => {
    setShowErrorAlert(false);
    await connectWallet();
  };

  if (!isConnected || !address) {
    return (
      <div className="relative">
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="gap-2 shadow-lg shadow-amber-500/20 px-5 py-2.5 text-sm sm:text-base font-bold bg-gradient-to-r from-stellar-orange to-amber-500 hover:from-orange-500 hover:to-amber-400 text-slate-950 transition-all transform hover:scale-105"
        >
          <Wallet className="w-5 h-5" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>

        {showErrorAlert && error && (
          <div className="absolute right-0 top-14 w-80 p-4 rounded-2xl bg-rose-950/95 border border-rose-800 text-rose-200 text-xs shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <p className="font-bold text-rose-300">Wallet Connection Notice</p>
                <p className="leading-relaxed text-slate-300">{error}</p>
                <button
                  onClick={() => setShowErrorAlert(false)}
                  className="text-[11px] underline text-rose-400 hover:text-rose-300 font-semibold"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 pl-3">
        {/* Balance Badge */}
        <div className="hidden sm:flex flex-col items-end pr-3 border-r border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Balance</span>
          <span className="text-xs sm:text-sm font-extrabold text-amber-400 font-mono">
            {balanceXlm !== null ? `${balanceXlm} XLM` : "Loading..."}
          </span>
        </div>

        {/* Account Pill Dropdown Trigger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-200 transition-colors"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{truncateAddress(address)}</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95">
          <div className="px-3 py-2 border-b border-slate-800 mb-2">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Network</p>
            <p className="text-xs font-bold text-slate-200">{network}</p>
          </div>

          <button
            onClick={async () => {
              await refreshBalance();
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-xl transition-colors mb-1"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            Refresh Balance
          </button>

          <button
            onClick={() => {
              setMenuOpen(false);
              disconnectWallet();
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
}
