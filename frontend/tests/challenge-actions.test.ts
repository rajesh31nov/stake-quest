import { describe, it, expect } from "vitest";
import { ChallengeStatus } from "@/types/challenge";
import { formatTimeRemaining } from "@/utils/formatters";

describe("Challenge Workflow & Status Mapping", () => {
  it("should verify status enum values match smart contract states", () => {
    expect(ChallengeStatus.Created).toBe("Created");
    expect(ChallengeStatus.Active).toBe("Active");
    expect(ChallengeStatus.ProofSubmitted).toBe("ProofSubmitted");
    expect(ChallengeStatus.Completed).toBe("Completed");
    expect(ChallengeStatus.Expired).toBe("Expired");
  });

  it("should calculate remaining time correctly for active challenges", () => {
    const futureTimestamp = Math.floor(Date.now() / 1000) + 86400; // +1 day
    const remaining = formatTimeRemaining(futureTimestamp);
    expect(remaining).toContain("1d");
  });

  it("should return Expired for past timestamps", () => {
    const pastTimestamp = Math.floor(Date.now() / 1000) - 3600; // -1 hour
    const remaining = formatTimeRemaining(pastTimestamp);
    expect(remaining).toBe("Expired");
  });
});
