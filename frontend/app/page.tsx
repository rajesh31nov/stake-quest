import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export const metadata = {
  title: "StakeQuest - Dashboard & Soroban Escrow Quests",
  description: "Decentralized accountability platform built on Stellar Soroban smart contracts. Lock XLM collateral, complete real-world challenges, and prove your commitment.",
};

export default function HomePage() {
  return <DashboardOverview />;
}
