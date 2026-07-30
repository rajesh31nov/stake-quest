"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Trophy,
  PlusCircle,
  Inbox,
  Send,
  UserCheck,
  Activity,
  History,
  BarChart3,
  Settings,
  LayoutDashboard,
} from "lucide-react";

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, iconColor: "text-amber-400" },
  { label: "Create Challenge", href: "/create", icon: PlusCircle, iconColor: "text-amber-400" },
  { label: "Received", href: "/received", icon: Inbox, iconColor: "text-cyan-400" },
  { label: "Sent", href: "/sent", icon: Send, iconColor: "text-amber-400" },
  { label: "My Challenges", href: "/my-challenges", icon: UserCheck, iconColor: "text-purple-400" },
  { label: "Activity Feed", href: "/activity", icon: Activity, iconColor: "text-emerald-400" },
  { label: "Tx Center", href: "/transactions", icon: History, iconColor: "text-cyan-400" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, iconColor: "text-amber-400" },
  { label: "Settings", href: "/settings", icon: Settings, iconColor: "text-slate-400" },
];

export function Sidebar() {
  const pathname = usePathname();

  // Hide sidebar on landing page
  if (pathname === "/") {
    return null;
  }

  return (
    <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 left-0 z-50 bg-slate-950 border-r border-slate-800/80 p-6 justify-between">
      <div className="space-y-8">
        {/* Brand Logo Header */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-stellar-orange via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Trophy className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-400 bg-clip-text text-transparent block">
              StakeQuest
            </span>
            <span className="text-[10px] font-bold tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase inline-block">
              Stellar Soroban
            </span>
          </div>
        </Link>

        {/* Feature Navigation List (Vertical, Large, Clear) */}
        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 rounded-2xl text-base font-bold flex items-center gap-3.5 transition-all duration-200 ${
                  isActive
                    ? "bg-slate-900 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/5 font-extrabold"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <IconComponent className={`w-5 h-5 ${item.iconColor}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Simplified Footer */}
      <div className="pt-6 border-t border-slate-900 text-center">
        <p className="text-xs font-semibold text-slate-500">StakeQuest dApp v1.0</p>
      </div>
    </aside>
  );
}
