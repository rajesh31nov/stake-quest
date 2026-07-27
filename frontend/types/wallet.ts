export type NetworkType = "TESTNET" | "PUBLIC" | "FUTURENET";

export interface WalletState {
  address: string | null;
  publicKey: string | null;
  walletId: string | null;
  walletName: string | null;
  walletIcon: string | null;
  network: NetworkType;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  balanceXlm: string | null;
}

export interface WalletOption {
  id: string;
  name: string;
  icon: string;
  isInstalled: boolean;
}
