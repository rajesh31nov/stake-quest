"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Menu, X, Globe } from "lucide-react";
import { WalletButton } from "@/components/wallet/wallet-button";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { NAV_ITEMS } from "./sidebar";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLandingPage = pathname === "/";
  const currentItem = NAV_ITEMS.find((item) => item.href === pathname) || NAV_ITEMS[0];

  if (isLandingPage) {
    return (
      <>
        <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            {/* Landing Page Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-stellar-orange via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Trophy className="w-5 h-5 text-slate-950" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-400 bg-clip-text text-transparent">
                  StakeQuest
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase">
                  Soroban
                </span>
              </div>
            </Link>

            {/* Right side Connect Wallet Option in Top Right Corner */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>Stellar Testnet</span>
              </div>
              <WalletButton />
            </div>
          </div>
        </header>
        <NotificationCenter />
      </>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-40 lg:pl-72 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Left Side: Page Context (Desktop) or Brand Logo (Mobile) */}
          <div className="flex items-center gap-3">
            {/* Mobile Brand Logo */}
            <Link href="/" className="lg:hidden flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-stellar-orange via-amber-500 to-yellow-400 flex items-center justify-center shadow-md">
                <Trophy className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-xl font-extrabold text-white">StakeQuest</span>
            </Link>

            {/* Desktop Page Context Indicator */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
                <currentItem.icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">{currentItem.label}</h2>
                <p className="text-[11px] text-slate-400">Stellar Soroban Testnet dApp</p>
              </div>
            </div>
          </div>

          {/* Right Side: Wallet Connection & Mobile Drawer Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Testnet</span>
            </div>

            <WalletButton />

            {/* Mobile Navigation Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-2 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {NAV_ITEMS.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-base font-bold flex items-center gap-3 transition-all ${
                      isActive
                        ? "bg-slate-900 text-amber-400 border border-amber-500/30"
                        : "text-slate-300 bg-slate-900/60 hover:bg-slate-800"
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${item.iconColor}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>
      <NotificationCenter />
    </>
  );
}
