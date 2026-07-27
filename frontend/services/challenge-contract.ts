import {
  Contract,
  Address,
  Account,
  nativeToScVal,
  scValToNative,
  TransactionBuilder,
  BASE_FEE,
  rpc,
} from "@stellar/stellar-sdk";
import { STELLAR_CONFIG } from "@/utils/stellar-constants";
import { stellarRpcService } from "./stellar-rpc";
import { walletKitService } from "./wallet-kit";
import { ChallengeModel, ChallengeStatus, CreateChallengeInput } from "@/types/challenge";
import { xlmToStroops, stroopsToXlm } from "@/utils/formatters";

export class ChallengeContractService {
  private contractId: string;

  constructor() {
    this.contractId = STELLAR_CONFIG.TESTNET.challengeContractId;
  }

  public getContractId(): string {
    return this.contractId;
  }

  private async executeTx(
    publicKey: string,
    operationName: string,
    callArgs: any[]
  ): Promise<string> {
    const rpcServer = stellarRpcService.getServer();
    const account = await stellarRpcService.loadAccount(publicKey);
    const contract = new Contract(this.contractId);

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: STELLAR_CONFIG.TESTNET.networkPassphrase,
    })
      .addOperation(contract.call(operationName, ...callArgs))
      .setTimeout(30)
      .build();

    const simulated = await rpcServer.simulateTransaction(tx);
    if (rpc.Api.isSimulationError(simulated)) {
      throw new Error(`Simulation failed: ${simulated.error}`);
    }

    const preparedTx = rpc.assembleTransaction(tx, simulated).build();
    const signedXdr = await walletKitService.signTransaction(preparedTx.toXDR());

    const sendRes = await rpcServer.sendTransaction(
      TransactionBuilder.fromXDR(signedXdr, STELLAR_CONFIG.TESTNET.networkPassphrase)
    );

    if (sendRes.status === "ERROR") {
      throw new Error(`Transaction rejected by network: ${JSON.stringify(sendRes)}`);
    }

    let getTxRes = await rpcServer.getTransaction(sendRes.hash);
    while (getTxRes.status === "NOT_FOUND") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      getTxRes = await rpcServer.getTransaction(sendRes.hash);
    }

    if (getTxRes.status === "FAILED") {
      throw new Error("Transaction execution failed on-chain.");
    }

    return sendRes.hash;
  }

  public async createChallenge(
    challengerPublicKey: string,
    input: CreateChallengeInput
  ): Promise<{ challengeId: number; txHash: string }> {
    const amountStroops = xlmToStroops(input.amountXlm);
    const durationSeconds = BigInt(input.durationDays * 86400);

    const callArgs = [
      new Address(challengerPublicKey).toScVal(),
      new Address(input.participantAddress).toScVal(),
      nativeToScVal(amountStroops, { type: "i128" }),
      nativeToScVal(durationSeconds, { type: "u64" }),
      nativeToScVal(input.title, { type: "string" }),
      nativeToScVal(input.description, { type: "string" }),
      nativeToScVal(input.requirements, { type: "string" }),
    ];

    const txHash = await this.executeTx(challengerPublicKey, "create_challenge", callArgs);
    return { challengeId: 1, txHash };
  }

  public async acceptChallenge(participantPublicKey: string, challengeId: number): Promise<string> {
    const callArgs = [
      new Address(participantPublicKey).toScVal(),
      nativeToScVal(BigInt(challengeId), { type: "u64" }),
    ];
    return await this.executeTx(participantPublicKey, "accept_challenge", callArgs);
  }

  public async rejectChallenge(participantPublicKey: string, challengeId: number): Promise<string> {
    const callArgs = [
      new Address(participantPublicKey).toScVal(),
      nativeToScVal(BigInt(challengeId), { type: "u64" }),
    ];
    return await this.executeTx(participantPublicKey, "reject_challenge", callArgs);
  }

  public async cancelChallenge(challengerPublicKey: string, challengeId: number): Promise<string> {
    const callArgs = [
      new Address(challengerPublicKey).toScVal(),
      nativeToScVal(BigInt(challengeId), { type: "u64" }),
    ];
    return await this.executeTx(challengerPublicKey, "cancel_challenge", callArgs);
  }

  public async submitProof(
    participantPublicKey: string,
    challengeId: number,
    proofUrl: string,
    notes: string
  ): Promise<string> {
    const callArgs = [
      new Address(participantPublicKey).toScVal(),
      nativeToScVal(BigInt(challengeId), { type: "u64" }),
      nativeToScVal(proofUrl, { type: "string" }),
      nativeToScVal(notes, { type: "string" }),
    ];
    return await this.executeTx(participantPublicKey, "submit_proof", callArgs);
  }

  public async resolveChallenge(
    challengerPublicKey: string,
    challengeId: number,
    approve: boolean
  ): Promise<string> {
    const callArgs = [
      new Address(challengerPublicKey).toScVal(),
      nativeToScVal(BigInt(challengeId), { type: "u64" }),
      nativeToScVal(approve, { type: "bool" }),
    ];
    return await this.executeTx(challengerPublicKey, "resolve_challenge", callArgs);
  }

  public async claimExpiredRefund(callerPublicKey: string, challengeId: number): Promise<string> {
    const callArgs = [
      new Address(callerPublicKey).toScVal(),
      nativeToScVal(BigInt(challengeId), { type: "u64" }),
    ];
    return await this.executeTx(callerPublicKey, "claim_expired_refund", callArgs);
  }

  public async getChallenge(challengeId: number): Promise<ChallengeModel | null> {
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
        .addOperation(contract.call("get_challenge", nativeToScVal(BigInt(challengeId), { type: "u64" })))
        .setTimeout(30)
        .build();

      const sim = await rpcServer.simulateTransaction(tx);
      if (!rpc.Api.isSimulationSuccess(sim) || !sim.result) return null;

      const raw = scValToNative(sim.result.retval);
      if (!raw) return null;

      return {
        id: Number(raw.id),
        challenger: raw.challenger,
        participant: raw.participant,
        amountXlm: stroopsToXlm(BigInt(raw.amount)),
        amountStroops: BigInt(raw.amount),
        durationSeconds: Number(raw.duration),
        deadlineTimestamp: Number(raw.deadline),
        status: (Object.keys(raw.status)[0] || ChallengeStatus.Created) as ChallengeStatus,
        title: raw.title,
        description: raw.description,
        requirements: raw.requirements,
        proof: raw.proof_url ? {
          proofUrl: raw.proof_url,
          notes: raw.proof_notes,
          submittedAt: Number(raw.proof_submitted_at),
        } : null,
        createdAt: Number(raw.created_at),
      };
    } catch (err) {
      console.error("Failed to query challenge:", err);
      return null;
    }
  }

  public async getChallengeCount(): Promise<number> {
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
        .addOperation(contract.call("get_challenge_count"))
        .setTimeout(30)
        .build();

      const sim = await rpcServer.simulateTransaction(tx);
      if (!rpc.Api.isSimulationSuccess(sim) || !sim.result) return 0;
      return Number(scValToNative(sim.result.retval));
    } catch {
      return 0;
    }
  }
}

export const challengeContractService = new ChallengeContractService();
