import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ActivityCard } from "@/components/activity/activity-card";
import { SorobanContractEvent } from "@/types/event";

describe("Activity Feed Component", () => {
  it("renders ActivityCard with correct event titles and categories", () => {
    const mockEvent: SorobanContractEvent = {
      id: "evt_999",
      contractId: "CC3J7GYCCKGS6FLA55Z7ST4UR42H64TTJGACBUWM3WMMHIYPHSAZJ7U",
      topic: "ch_done",
      category: "PAYOUT",
      title: "Challenge #1 Completed",
      description: "Reward released to participant",
      challengeId: 1,
      timestamp: Date.now(),
      ledger: 100200,
    };

    render(<ActivityCard event={mockEvent} />);

    expect(screen.getByText("Challenge #1 Completed")).toBeInTheDocument();
    expect(screen.getByText("Reward released to participant")).toBeInTheDocument();
    expect(screen.getByText("PAYOUT")).toBeInTheDocument();
  });
});
