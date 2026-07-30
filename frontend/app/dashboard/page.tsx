import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export const metadata = {
  title: "StakeQuest - Dashboard Overview",
  description: "Real-time statistics for your Stellar Soroban accountability challenges and active XLM escrows.",
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
