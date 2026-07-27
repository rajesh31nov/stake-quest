import { describe, it, expect } from "vitest";
import { truncateAddress, stroopsToXlm, xlmToStroops } from "@/utils/formatters";
import { parseStellarError } from "@/utils/errors";

describe("Formatting & Error Utilities", () => {
  it("should truncate Stellar public key addresses", () => {
    const addr = "GABC12345678901234567890123456789012345678901234567890XYZ";
    expect(truncateAddress(addr)).toBe("GABC12...0XYZ");
    expect(truncateAddress("")).toBe("");
  });

  it("should convert between XLM and Stroops correctly", () => {
    expect(xlmToStroops("10")).toBe(100_000_000n);
    expect(stroopsToXlm(100_000_000n)).toBe("10.00");
  });

  it("should parse user cancellation error messages into friendly strings", () => {
    expect(parseStellarError("User rejected the transaction")).toBe(
      "Transaction was cancelled in your wallet."
    );
    expect(parseStellarError("InvalidAmount")).toBe(
      "Challenge stake amount must be greater than 0 XLM."
    );
  });
});
