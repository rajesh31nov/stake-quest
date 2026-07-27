import { Contract, Account, nativeToScVal, scValToNative, TransactionBuilder, BASE_FEE, rpc } from "@stellar/stellar-sdk";
import { STELLAR_CONFIG } from "@/utils/stellar-constants";
import { stellarRpcService } from "./stellar-rpc";
import { EscrowRecordModel, EscrowStatus } from "@/types/escrow";
import { stroopsToXlm } from "@/utils/formatters";

export class EscrowContractService {
  private contractId: string;

  constructor() {
    this.contractId = STELLAR_CONFIG.TESTNET.escrowContractId;
  }

  public async getEscrow(challengeId: number): Promise<EscrowRecordModel | null> {
    try {
      const rpcServer = stellarRpcService.getServer();
      const dummyAddr = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";
      const contract = new Contract(this.contractId);

      const tx = new TransactionBuilder(
        new Account(dummyAddr, "0"),
        {
          fee: BASE_FEE,
          networkPassphrase: STELLAR_CONFIG.TESTNET.networkPassphrase,
        }
      )
        .addOperation(contract.call("get_escrow", nativeToScVal(BigInt(challengeId), { type: "u64" })))
        .setTimeout(30)
        .build();

      const sim = await rpcServer.simulateTransaction(tx);
      if (!rpc.Api.isSimulationSuccess(sim) || !sim.result) return null;

      const raw = scValToNative(sim.result.retval);
      if (!raw) return null;

      return {
        challengeId: Number(raw.challenge_id),
        challenger: raw.challenger,
        amountStroops: BigInt(raw.amount),
        amountXlm: stroopsToXlm(BigInt(raw.amount)),
        status: (Object.keys(raw.status)[0] || EscrowStatus.Locked) as EscrowStatus,
      };
    } catch (err) {
      console.error("Failed to query escrow record:", err);
      return null;
    }
  }
}

export const escrowContractService = new EscrowContractService();
