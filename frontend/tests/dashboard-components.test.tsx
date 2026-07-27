import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatCard } from "@/components/dashboard/stat-card";
import { Coins } from "lucide-react";

describe("Dashboard Components", () => {
  it("renders StatCard title, value, and subtitle correctly", () => {
    render(
      <StatCard
        title="Total XLM Staked"
        value="150.00 XLM"
        subtitle="Locked in Soroban Escrow"
        icon={<Coins data-testid="coins-icon" />}
      />
    );

    expect(screen.getByText("Total XLM Staked")).toBeInTheDocument();
    expect(screen.getByText("150.00 XLM")).toBeInTheDocument();
    expect(screen.getByText("Locked in Soroban Escrow")).toBeInTheDocument();
  });
});
