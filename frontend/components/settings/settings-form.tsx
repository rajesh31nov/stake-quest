"use client";

import React, { useState } from "react";
import { Settings, Globe, Bell, Shield, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastBanner } from "@/components/ui/toast";
import { useSettings } from "@/hooks/use-settings";
import { NetworkType } from "@/types/wallet";

export function SettingsForm() {
  const { network, customRpcUrl, notifications, setNetwork, setCustomRpcUrl, updateNotifications } = useSettings();
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-amber-400" />
          Settings & Network Preferences
        </h1>
        <p className="text-xs text-slate-400 mt-1">Configure your Stellar network connections, RPC endpoints, and notification alerts.</p>
      </div>

      {savedMessage && (
        <ToastBanner type="success" title="Settings Saved" message="Your preferences have been saved to local storage." />
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Network Selection */}
        <Card className="border-slate-800 bg-slate-900/80 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <Globe className="w-5 h-5" />
              <CardTitle className="text-lg font-bold text-white">Stellar Network Configuration</CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-400">
              Select your target Stellar Soroban network environment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Network Selection</label>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value as NetworkType)}
                className="w-full h-11 rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
              >
                <option value="TESTNET">Stellar Testnet (Default - Soroban Protocol 21/22)</option>
                <option value="FUTURENET">Stellar Futurenet (Experimental)</option>
                <option value="PUBLIC">Stellar Public Mainnet</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Soroban RPC URL Endpoint</label>
              <Input
                value={customRpcUrl}
                onChange={(e) => setCustomRpcUrl(e.target.value)}
                placeholder="https://soroban-testnet.stellar.org"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="border-slate-800 bg-slate-900/80 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <Bell className="w-5 h-5" />
              <CardTitle className="text-lg font-bold text-white">Notification Preferences</CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-400">
              Manage in-app alert notifications for challenge events and escrow payouts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span className="text-xs font-medium text-slate-200">In-App Alert Notifications</span>
              <input
                type="checkbox"
                checked={notifications.inAppAlerts}
                onChange={(e) => updateNotifications({ inAppAlerts: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span className="text-xs font-medium text-slate-200">Challenge Invitation Alerts</span>
              <input
                type="checkbox"
                checked={notifications.challengeInvitations}
                onChange={(e) => updateNotifications({ challengeInvitations: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span className="text-xs font-medium text-slate-200">Proof Submission Notifications</span>
              <input
                type="checkbox"
                checked={notifications.proofSubmissions}
                onChange={(e) => updateNotifications({ proofSubmissions: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span className="text-xs font-medium text-slate-200">Escrow Reward Release Payout Alerts</span>
              <input
                type="checkbox"
                checked={notifications.rewardPayouts}
                onChange={(e) => updateNotifications({ rewardPayouts: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
              />
            </label>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full h-12 text-base font-bold gap-2">
          <Save className="w-4 h-4" />
          Save Settings & Preferences
        </Button>
      </form>
    </div>
  );
}
