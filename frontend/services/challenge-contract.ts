import {
  Address,
  Account,
  Operation,
  scValToNative,
  TransactionBuilder,
  BASE_FEE,
  rpc,
  xdr,
} from "@stellar/stellar-sdk";
import { STELLAR_CONFIG } from "@/utils/stellar-constants";
import { stellarRpcService } from "./stellar-rpc";
import { walletKitService } from "./wallet-kit";
import { ChallengeModel, ChallengeStatus, CreateChallengeInput } from "@/types/challenge";
import { xlmToStroops, stroopsToXlm } from "@/utils/formatters";

/**
 * Convert BigInt to Soroban i128 ScVal XDR
 */
export function bigIntToI128ScVal(value: bigint): xdr.ScVal {
  const big = BigInt(value);
  const low = BigInt.asUintN(64, big);
  const high = BigInt.asIntN(64, big >> 64n);

  return xdr.ScVal.scvI128(
    new xdr.Int128Parts({
      hi: xdr.Int64.fromString(high.toString()),
      lo: xdr.Uint64.fromString(low.toString()),
    })
  );
}

/**
 * Convert BigInt/number to Soroban u64 ScVal XDR
 */
export function bigIntToU64ScVal(value: bigint | number): xdr.ScVal {
  return xdr.ScVal.scvU64(xdr.Uint64.fromString(BigInt(value).toString()));
}

/**
 * Convert string to Soroban String ScVal XDR
 */
export function stringToScVal(str: string): xdr.ScVal {
  return xdr.ScVal.scvString(str);
}

/**
 * Convert boolean to Soroban Bool ScVal XDR
 */
export function boolToScVal(b: boolean): xdr.ScVal {
  return xdr.ScVal.scvBool(b);
}

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
    callArgs: xdr.ScVal[]
  ): Promise<string> {
    const rpcServer = stellarRpcService.getServer();
    const account = await stellarRpcService.loadAccount(publicKey);

    const invokeOp = Operation.invokeHostFunction({
      func: xdr.HostFunction.hostFunctionTypeInvokeContract(
        new xdr.InvokeContractArgs({
          contractAddress: Address.fromString(this.contractId).toScAddress(),
          functionName: operationName,
          args: callArgs,
        })
      ),
      auth: [],
    });

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: STELLAR_CONFIG.TESTNET.networkPassphrase,
    })
      .addOperation(invokeOp)
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

    const callArgs: xdr.ScVal[] = [
      new Address(challengerPublicKey).toScVal(),
      new Address(input.participantAddress).toScVal(),
      bigIntToI128ScVal(amountStroops),
      bigIntToU64ScVal(durationSeconds),
      stringToScVal(input.title),
      stringToScVal(input.description),
      stringToScVal(input.requirements),
    ];

    const txHash = await this.executeTx(challengerPublicKey, "create_challenge", callArgs);
    const challengeId = await this.getChallengeCount();

    return { challengeId: challengeId > 0 ? challengeId : 1, txHash };
  }

  public async acceptChallenge(participantPublicKey: string, challengeId: number): Promise<string> {
    const callArgs: xdr.ScVal[] = [
      new Address(participantPublicKey).toScVal(),
      bigIntToU64ScVal(BigInt(challengeId)),
    ];
    return await this.executeTx(participantPublicKey, "accept_challenge", callArgs);
  }

  public async rejectChallenge(participantPublicKey: string, challengeId: number): Promise<string> {
    const callArgs: xdr.ScVal[] = [
      new Address(participantPublicKey).toScVal(),
      bigIntToU64ScVal(BigInt(challengeId)),
    ];
    return await this.executeTx(participantPublicKey, "reject_challenge", callArgs);
  }

  public async cancelChallenge(challengerPublicKey: string, challengeId: number): Promise<string> {
    const callArgs: xdr.ScVal[] = [
      new Address(challengerPublicKey).toScVal(),
      bigIntToU64ScVal(BigInt(challengeId)),
    ];
    return await this.executeTx(challengerPublicKey, "cancel_challenge", callArgs);
  }

  public async submitProof(
    participantPublicKey: string,
    challengeId: number,
    proofUrl: string,
    notes: string
  ): Promise<string> {
    const callArgs: xdr.ScVal[] = [
      new Address(participantPublicKey).toScVal(),
      bigIntToU64ScVal(BigInt(challengeId)),
      stringToScVal(proofUrl),
      stringToScVal(notes),
    ];
    return await this.executeTx(participantPublicKey, "submit_proof", callArgs);
  }

  public async resolveChallenge(
    challengerPublicKey: string,
    challengeId: number,
    approve: boolean
  ): Promise<string> {
    const callArgs: xdr.ScVal[] = [
      new Address(challengerPublicKey).toScVal(),
      bigIntToU64ScVal(BigInt(challengeId)),
      boolToScVal(approve),
    ];
    return await this.executeTx(challengerPublicKey, "resolve_challenge", callArgs);
  }

  public async claimExpiredRefund(callerPublicKey: string, challengeId: number): Promise<string> {
    const callArgs: xdr.ScVal[] = [
      new Address(callerPublicKey).toScVal(),
      bigIntToU64ScVal(BigInt(challengeId)),
    ];
    return await this.executeTx(callerPublicKey, "claim_expired_refund", callArgs);
  }

  public async getChallenge(challengeId: number): Promise<ChallengeModel | null> {
    try {
      const rpcServer = stellarRpcService.getServer();
      const dummyAddr = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";

      const invokeOp = Operation.invokeHostFunction({
        func: xdr.HostFunction.hostFunctionTypeInvokeContract(
          new xdr.InvokeContractArgs({
            contractAddress: Address.fromString(this.contractId).toScAddress(),
            functionName: "get_challenge",
            args: [bigIntToU64ScVal(BigInt(challengeId))],
          })
        ),
        auth: [],
      });

      const tx = new TransactionBuilder(
        new Account(dummyAddr, "0"),
        {
          fee: BASE_FEE,
          networkPassphrase: STELLAR_CONFIG.TESTNET.networkPassphrase,
        }
      )
        .addOperation(invokeOp)
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

      const invokeOp = Operation.invokeHostFunction({
        func: xdr.HostFunction.hostFunctionTypeInvokeContract(
          new xdr.InvokeContractArgs({
            contractAddress: Address.fromString(this.contractId).toScAddress(),
            functionName: "get_challenge_count",
            args: [],
          })
        ),
        auth: [],
      });

      const tx = new TransactionBuilder(
        new Account(dummyAddr, "0"),
        {
          fee: BASE_FEE,
          networkPassphrase: STELLAR_CONFIG.TESTNET.networkPassphrase,
        }
      )
        .addOperation(invokeOp)
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
