import { describe, it, expect } from "vitest";
import { explorerService } from "@/services/explorer-service";
import { eventsService } from "@/services/events-service";

describe("Explorer Service & Event Parsing", () => {
  it("should generate valid Stellar Expert URLs for transaction hashes", () => {
    const hash = "a1b2c3d4e5f67890123456789012345678901234567890123456789012345678";
    const url = explorerService.getTxUrl(hash);
    expect(url).toContain("/tx/a1b2c3d4e5f67890123456789012345678901234567890123456789012345678");
  });

  it("should parse raw Soroban event structures correctly", () => {
    const mockRawEvent = {
      id: "evt_123",
      contractId: "CC3J7GYCCKGS6FLA55Z7ST4UR42H64TTJGACBUWM3WMMHIYPHSAZJ7U",
      topic: ["ch_active", 5],
      value: null,
      ledger: 123456,
    };

    const parsed = eventsService.parseSorobanEvent(mockRawEvent);
    expect(parsed).not.toBeNull();
    expect(parsed?.category).toBe("CREATION");
    expect(parsed?.title).toBe("Challenge #5 Activated");
  });
});
