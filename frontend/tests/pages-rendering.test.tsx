import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ActivityPage from "@/app/activity/page";
import TransactionsPage from "@/app/transactions/page";
import AnalyticsPage from "@/app/analytics/page";
import SettingsPage from "@/app/settings/page";
import { QueryProvider } from "@/components/providers/query-provider";

describe("Application Pages Component Tests", () => {
  it("renders Activity Page without crashing", () => {
    render(
      <QueryProvider>
        <ActivityPage />
      </QueryProvider>
    );
    expect(screen.getByText("Live Activity Feed")).toBeInTheDocument();
  });

  it("renders Transactions Page without crashing", () => {
    render(
      <QueryProvider>
        <TransactionsPage />
      </QueryProvider>
    );
    expect(screen.getByText("Transaction Center")).toBeInTheDocument();
  });

  it("renders Analytics Page without crashing", () => {
    render(
      <QueryProvider>
        <AnalyticsPage />
      </QueryProvider>
    );
    expect(screen.getByText("Performance & Reward Analytics")).toBeInTheDocument();
  });

  it("renders Settings Page without crashing", () => {
    render(
      <QueryProvider>
        <SettingsPage />
      </QueryProvider>
    );
    expect(screen.getByText("Settings & Network Preferences")).toBeInTheDocument();
  });
});
