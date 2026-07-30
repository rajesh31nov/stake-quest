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
      const res = await fetch(`https://horizon-testnet.stellar.org/accounts/${publicKey}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const nativeBalance = data.balances?.find((b: any) => b.asset_type === "native");
        if (nativeBalance) {
          const num = parseFloat(nativeBalance.balance);
          return isNaN(num)
            ? "0.00"
            : num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
      }
      return "0.00";
    } catch (err) {
      console.warn("Failed to fetch balance from Horizon:", err);
      return "0.00";
    }
  }

  public async loadAccount(publicKey: string): Promise<Account> {
    return await this.server.getAccount(publicKey);
  }
}

export const stellarRpcService = new StellarRpcService();
