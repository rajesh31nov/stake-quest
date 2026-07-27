import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ChallengeStatusBadge } from "@/components/challenge/challenge-status-badge";
import { ChallengeStatus, ChallengeModel } from "@/types/challenge";
import { ChallengeCard } from "@/components/challenge/challenge-card";
import { QueryProvider } from "@/components/providers/query-provider";

describe("Challenge Components Test Suite", () => {
  it("renders ChallengeStatusBadge correctly for various states", () => {
    const { rerender } = render(<ChallengeStatusBadge status={ChallengeStatus.Created} />);
    expect(screen.getByText("Pending Acceptance")).toBeInTheDocument();

    rerender(<ChallengeStatusBadge status={ChallengeStatus.Active} />);
    expect(screen.getByText("Active")).toBeInTheDocument();

    rerender(<ChallengeStatusBadge status={ChallengeStatus.Completed} />);
    expect(screen.getByText("Completed & Paid")).toBeInTheDocument();
  });

  it("renders ChallengeCard with correct title and XLM stake badge", () => {
    const mockChallenge: ChallengeModel = {
      id: 1,
      challenger: "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
      participant: "GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBWHF",
      amountXlm: "25.00",
      amountStroops: 250000000n,
      durationSeconds: 86400,
      deadlineTimestamp: 0,
      status: ChallengeStatus.Created,
      title: "Solve 100 Algorithmic Problems",
      description: "Solve 100 LeetCode problems in 14 days",
      requirements: "GitHub repo submission link",
      proof: null,
      createdAt: Date.now(),
    };

    render(
      <QueryProvider>
        <ChallengeCard challenge={mockChallenge} />
      </QueryProvider>
    );

    expect(screen.getByText("Solve 100 Algorithmic Problems")).toBeInTheDocument();
    expect(screen.getByText("25.00 XLM")).toBeInTheDocument();
  });
});
