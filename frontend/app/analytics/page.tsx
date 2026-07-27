import { AnalyticsOverview } from "@/components/analytics/analytics-overview";

export const metadata = {
  title: "Analytics & Reward Distribution - StakeQuest",
  description: "Track completion rates, XLM rewards earned, and Soroban contract transaction performance metrics.",
};

export default function AnalyticsPage() {
  return <AnalyticsOverview />;
}
