import {
  isConnected,
  requestAccess,
  getPublicKey,
  signTransaction,
} from "@stellar/freighter-api";
import { STELLAR_CONFIG } from "@/utils/stellar-constants";

class WalletKitService {
  /**
   * Check if Freighter extension is installed in the browser
   */
  public async isFreighterInstalled(): Promise<boolean> {
    if (typeof window !== "undefined" && Boolean((window as any).freighterApi)) {
      return true;
    }
    try {
      const res: any = await isConnected();
      if (typeof res === "boolean") return res;
      if (res && typeof res.isConnected === "boolean") return res.isConnected;
      return Boolean(res);
    } catch {
      return false;
    }
  }

  /**
   * Request wallet connection and retrieve user public key address
   */
  public async openConnectModal(
    onAddressSelected: (address: string, walletId: string) => void
  ): Promise<void> {
    try {
      const installed = await this.isFreighterInstalled();
      const hasWindowApi =
        typeof window !== "undefined" &&
        Boolean((window as any).freighterApi || (window as any).starlight);

      if (!installed && !hasWindowApi) {
        throw new Error(
          "Freighter wallet extension is not installed in your browser. Please install the Freighter extension from https://freighter.app and refresh this page."
        );
      }

      let pubKey: string = "";

      // Step 1: Prompt Freighter permission modal via requestAccess()
      try {
        const accessRes: any = await requestAccess();
        if (typeof accessRes === "string" && accessRes.startsWith("G")) {
          pubKey = accessRes;
        } else if (accessRes?.address && typeof accessRes.address === "string") {
          pubKey = accessRes.address;
        } else if (accessRes?.publicKey && typeof accessRes.publicKey === "string") {
          pubKey = accessRes.publicKey;
        } else if (Array.isArray(accessRes) && accessRes[0]) {
          pubKey = typeof accessRes[0] === "string" ? accessRes[0] : accessRes[0].address;
        }
      } catch (err: any) {
        console.warn("requestAccess failed or pending, trying getPublicKey fallback...", err);
      }

      // Step 2: Fallback to getPublicKey()
      if (!pubKey) {
        try {
          const keyRes: any = await getPublicKey();
          if (typeof keyRes === "string" && keyRes.startsWith("G")) {
            pubKey = keyRes;
          } else if (keyRes?.publicKey && typeof keyRes.publicKey === "string") {
            pubKey = keyRes.publicKey;
          } else if (keyRes?.address && typeof keyRes.address === "string") {
            pubKey = keyRes.address;
          }
        } catch (err) {
          console.warn("getPublicKey fallback failed:", err);
        }
      }

      if (!pubKey || !pubKey.startsWith("G")) {
        throw new Error(
          "Could not retrieve public key address from Freighter wallet. Please open your Freighter extension window, unlock your account, and approve the connection prompt."
        );
      }

      onAddressSelected(pubKey, "freighter");
    } catch (error: any) {
      console.error("Failed to connect Freighter wallet:", error);
      throw error;
    }
  }

  public async getPublicKeyAddress(): Promise<string> {
    const installed = await this.isFreighterInstalled();
    if (!installed) {
      throw new Error("Freighter wallet is not installed.");
    }
    const keyRes: any = await getPublicKey();
    const address = typeof keyRes === "string" ? keyRes : keyRes?.publicKey || keyRes?.address;
    if (!address || typeof address !== "string") {
      throw new Error("Freighter wallet is not connected.");
    }
    return address;
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
