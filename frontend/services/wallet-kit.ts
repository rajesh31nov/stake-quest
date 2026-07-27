import {
  isConnected,
  getPublicKey,
  signTransaction,
} from "@stellar/freighter-api";
import { STELLAR_CONFIG } from "@/utils/stellar-constants";

class WalletKitService {
  public async isFreighterInstalled(): Promise<boolean> {
    try {
      const res = await isConnected();
      return Boolean(res);
    } catch {
      return false;
    }
  }

  public async openConnectModal(
    onAddressSelected: (address: string, walletId: string) => void
  ): Promise<void> {
    try {
      const installed = await this.isFreighterInstalled();
      if (!installed) {
        throw new Error(
          "Freighter wallet is not installed. Please install the Freighter browser extension."
        );
      }

      const key = await getPublicKey();
      if (!key) {
        throw new Error("User declined wallet connection request.");
      }

      onAddressSelected(key, "freighter");
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  }

  public async getPublicKey(): Promise<string> {
    const key = await getPublicKey();
    if (!key) {
      throw new Error("Freighter wallet is not connected.");
    }
    return key;
  }

  public async signTransaction(xdr: string): Promise<string> {
    const signedXdr = await signTransaction(xdr, {
      networkPassphrase: STELLAR_CONFIG.TESTNET.networkPassphrase,
    });
    if (!signedXdr) {
      throw new Error("Transaction signing was cancelled by the user.");
    }
    return signedXdr;
  }
}

export const walletKitService = new WalletKitService();
