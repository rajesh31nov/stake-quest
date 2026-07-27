"use client";

import React from "react";
import { Wallet, LogOut, RefreshCw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { truncateAddress } from "@/utils/formatters";

export function WalletButton() {
  const {
    address,
    isConnected,
    isConnecting,
    balanceXlm,
    network,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  } = useWallet();

  const [menuOpen, setMenuOpen] = React.useState(false);

  if (!isConnected || !address) {
    return (
      <Button
        onClick={connectWallet}
        disabled={isConnecting}
        className="gap-2 shadow-amber-500/20"
      >
        <Wallet className="w-4 h-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 pl-3">
        {/* Balance Badge */}
        <div className="hidden sm:flex flex-col items-end pr-2 border-r border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Balance</span>
          <span className="text-xs font-bold text-amber-400">
            {balanceXlm !== null ? `${balanceXlm} XLM` : "Loading..."}
          </span>
        </div>

        {/* Account Pill Dropdown Trigger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{truncateAddress(address)}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95">
          <div className="px-3 py-2 border-b border-slate-800 mb-2">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Network</p>
            <p className="text-xs font-bold text-slate-200">{network}</p>
          </div>

          <button
            onClick={async () => {
              await refreshBalance();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-xl transition-colors mb-1"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            Refresh Balance
          </button>

          <button
            onClick={() => {
              setMenuOpen(false);
              disconnectWallet();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
}
