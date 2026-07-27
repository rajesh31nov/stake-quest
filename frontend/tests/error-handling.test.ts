import { describe, it, expect } from "vitest";
import { parseStellarError } from "@/utils/errors";

describe("Stellar & Soroban Error Parser", () => {
  it("should format UserDeclined error messages cleanly", () => {
    const err = { message: "UserDeclined: User rejected the transaction request." };
    const parsed = parseStellarError(err);
    expect(parsed).toBe("Transaction was cancelled in your wallet.");
  });

  it("should handle generic HostError strings", () => {
    const err = new Error("HostError: Error(Contract, #1)");
    const parsed = parseStellarError(err);
    expect(parsed).toContain("HostError");
  });

  it("should handle timeout errors", () => {
    const err = new Error("Transaction submit timeout exceeded after 30 seconds");
    const parsed = parseStellarError(err);
    expect(parsed).toContain("timeout");
  });

  it("should return fallback for unknown errors", () => {
    const parsed = parseStellarError(null);
    expect(parsed).toBe("An unknown error occurred.");
  });
});
