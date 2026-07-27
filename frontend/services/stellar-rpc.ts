import { rpc, Account } from "@stellar/stellar-sdk";
import { STELLAR_CONFIG } from "@/utils/stellar-constants";

export class StellarRpcService {
  private server: rpc.Server;

  constructor() {
    this.server = new rpc.Server(STELLAR_CONFIG.TESTNET.rpcUrl);
  }

  public getServer(): rpc.Server {
    return this.server;
  }

  public async getAccountBalance(publicKey: string): Promise<string> {
    try {
      const account: any = await this.server.getAccount(publicKey);
      if (account && Array.isArray(account.balances)) {
        const nativeBalance = account.balances.find(
          (b: any) => b.asset_type === "native"
        );
        return nativeBalance ? nativeBalance.balance : "0.00";
      }
      return "0.00";
    } catch (err) {
      console.warn("Account not found or unfunded on Testnet:", publicKey);
      return "0.00";
    }
  }

  public async loadAccount(publicKey: string): Promise<Account> {
    return await this.server.getAccount(publicKey);
  }
}

export const stellarRpcService = new StellarRpcService();
