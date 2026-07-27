import { SettingsForm } from "@/components/settings/settings-form";

export const metadata = {
  title: "Settings - StakeQuest",
  description: "Configure Stellar network selection, RPC endpoint configuration, and notification preferences.",
};

export default function SettingsPage() {
  return <SettingsForm />;
}
