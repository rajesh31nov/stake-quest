import { STELLAR_CONFIG } from "./stellar-constants";

export function truncateAddress(address: string | null | undefined, chars = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function truncateHash(hash: string | null | undefined, chars = 6): string {
  if (!hash) return "";
  if (hash.length <= chars * 2) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}

export function getStellarExplorerTxUrl(hash?: string): string {
  if (hash && hash.length === 64 && !hash.startsWith("tx_")) {
    return `https://stellar.expert/explorer/testnet/tx/${hash}`;
  }
  return `https://stellar.expert/explorer/testnet/contract/${STELLAR_CONFIG.TESTNET.challengeContractId}`;
}

export function stroopsToXlm(stroops: bigint): string {
  const xlm = Number(stroops) / Number(STELLAR_CONFIG.STROOPS_PER_XLM);
  return xlm.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 7 });
}

export function xlmToStroops(xlmAmount: string): bigint {
  const num = parseFloat(xlmAmount);
  if (isNaN(num) || num <= 0) return 0n;
  return BigInt(Math.round(num * Number(STELLAR_CONFIG.STROOPS_PER_XLM)));
}

export function formatTimeRemaining(deadlineTimestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = deadlineTimestamp - now;

  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
}
