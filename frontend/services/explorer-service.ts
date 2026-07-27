import { STELLAR_CONFIG } from "@/utils/stellar-constants";

export class ExplorerService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = STELLAR_CONFIG.TESTNET.explorerUrl;
  }

  public getTxUrl(hash?: string): string {
    if (!hash) return `${this.baseUrl}/tx/`;
    return `${this.baseUrl}/tx/${hash}`;
  }

  public getAccountUrl(address?: string): string {
    if (!address) return `${this.baseUrl}/account/`;
    return `${this.baseUrl}/account/${address}`;
  }

  public getContractUrl(contractId?: string): string {
    if (!contractId) return `${this.baseUrl}/contract/`;
    return `${this.baseUrl}/contract/${contractId}`;
  }
}

export const explorerService = new ExplorerService();
