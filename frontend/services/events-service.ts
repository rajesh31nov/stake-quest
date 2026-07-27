import { scValToNative } from "@stellar/stellar-sdk";
import { STELLAR_CONFIG } from "@/utils/stellar-constants";
import { stellarRpcService } from "./stellar-rpc";
import { SorobanContractEvent, EventCategory } from "@/types/event";
import { stroopsToXlm, truncateAddress } from "@/utils/formatters";

export class EventsService {
  private challengeContractId: string;
  private escrowContractId: string;

  constructor() {
    this.challengeContractId = STELLAR_CONFIG.TESTNET.challengeContractId;
    this.escrowContractId = STELLAR_CONFIG.TESTNET.escrowContractId;
  }

  /**
   * Fetch recent events from Soroban RPC getEvents
   */
  public async fetchContractEvents(): Promise<SorobanContractEvent[]> {
    try {
      const rpcServer = stellarRpcService.getServer();
      const latestLedger = await rpcServer.getLatestLedger();
      const startLedger = Math.max(1, latestLedger.sequence - 10000);

      const response = await rpcServer.getEvents({
        startLedger,
        filters: [
          {
            type: "contract",
            contractIds: [this.challengeContractId, this.escrowContractId],
          },
        ],
        limit: 50,
      });

      if (!response.events) return [];

      const parsedEvents: SorobanContractEvent[] = [];

      for (const event of response.events) {
        const parsed = this.parseSorobanEvent(event);
        if (parsed) {
          parsedEvents.push(parsed);
        }
      }

      return parsedEvents.reverse(); // Most recent first
    } catch (err) {
      console.warn("Failed to fetch Soroban RPC events:", err);
      return [];
    }
  }

  /**
   * Decode raw Soroban event XDR into a clean domain event model
   */
  public parseSorobanEvent(rawEvent: any): SorobanContractEvent | null {
    try {
      if (!rawEvent || !rawEvent.topic || !rawEvent.topic.length) return null;

      let topicSymbol = "";
      try {
        topicSymbol = typeof rawEvent.topic[0] === "string"
          ? rawEvent.topic[0]
          : (scValToNative(rawEvent.topic[0]) as string);
      } catch {
        topicSymbol = String(rawEvent.topic[0] || "");
      }

      let challengeId: number | undefined;
      if (rawEvent.topic[1] !== undefined) {
        try {
          challengeId = typeof rawEvent.topic[1] === "number"
            ? rawEvent.topic[1]
            : Number(scValToNative(rawEvent.topic[1]));
        } catch {
          challengeId = Number(rawEvent.topic[1]);
        }
      }

      let dataVal: any = null;
      if (rawEvent.value) {
        try {
          dataVal = typeof rawEvent.value === "object" && rawEvent.value._switch
            ? scValToNative(rawEvent.value)
            : rawEvent.value;
        } catch {
          dataVal = rawEvent.value;
        }
      }

      let category: EventCategory = "ALL";
      let title = "Contract Event";
      let description = "Event emitted on Soroban blockchain.";
      let actorAddress: string | undefined;
      let amountXlm: string | undefined;

      switch (topicSymbol) {
        case "ch_create":
          category = "CREATION";
          title = `Challenge #${challengeId} Created`;
          if (Array.isArray(dataVal)) {
            actorAddress = String(dataVal[0]);
            amountXlm = stroopsToXlm(BigInt(dataVal[2]));
            description = `Challenger ${truncateAddress(actorAddress)} staked ${amountXlm} XLM for Participant ${truncateAddress(String(dataVal[1]))}.`;
          }
          break;

        case "ch_active":
          category = "CREATION";
          title = `Challenge #${challengeId} Activated`;
          description = `Participant accepted challenge #${challengeId}. Countdown timer started.`;
          break;

        case "ch_proof":
          category = "PROOF";
          title = `Proof Submitted for #${challengeId}`;
          if (Array.isArray(dataVal)) {
            actorAddress = String(dataVal[0]);
            description = `Participant ${truncateAddress(actorAddress)} submitted proof: "${dataVal[1]}"`;
          }
          break;

        case "ch_done":
          category = "PAYOUT";
          title = `Challenge #${challengeId} Completed`;
          if (Array.isArray(dataVal)) {
            description = `Challenger ${truncateAddress(String(dataVal[0]))} verified proof. Reward released to ${truncateAddress(String(dataVal[1]))}.`;
          }
          break;

        case "ch_prej":
          category = "PROOF";
          title = `Proof Rejected for #${challengeId}`;
          description = `Challenger rejected submitted proof for challenge #${challengeId}.`;
          break;

        case "ch_exp":
          category = "PAYOUT";
          title = `Challenge #${challengeId} Expired`;
          description = `Deadline passed without completion. Challenge #${challengeId} marked expired.`;
          break;

        case "dep_esc":
          category = "ESCROW";
          title = `Escrow Deposit #${challengeId}`;
          if (Array.isArray(dataVal)) {
            actorAddress = String(dataVal[0]);
            amountXlm = stroopsToXlm(BigInt(dataVal[1]));
            description = `Locked ${amountXlm} XLM from ${truncateAddress(actorAddress)} into Escrow Vault.`;
          }
          break;

        case "rel_esc":
          category = "ESCROW";
          title = `Escrow Payout #${challengeId}`;
          if (Array.isArray(dataVal)) {
            actorAddress = String(dataVal[0]);
            amountXlm = stroopsToXlm(BigInt(dataVal[1]));
            description = `Released ${amountXlm} XLM reward from Escrow to ${truncateAddress(actorAddress)}.`;
          }
          break;

        case "ref_esc":
          category = "ESCROW";
          title = `Escrow Refund #${challengeId}`;
          if (Array.isArray(dataVal)) {
            actorAddress = String(dataVal[0]);
            amountXlm = stroopsToXlm(BigInt(dataVal[1]));
            description = `Refunded ${amountXlm} XLM from Escrow back to Challenger ${truncateAddress(actorAddress)}.`;
          }
          break;

        default:
          return null;
      }

      return {
        id: rawEvent.id || `evt_${Date.now()}_${Math.random()}`,
        contractId: rawEvent.contractId,
        topic: topicSymbol,
        category,
        title,
        description,
        challengeId,
        actorAddress,
        amountXlm,
        timestamp: Date.now(),
        ledger: rawEvent.ledger || 0,
      };
    } catch (err) {
      return null;
    }
  }
}

export const eventsService = new EventsService();
