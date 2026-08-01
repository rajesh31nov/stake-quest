function cleanPassphrase(val?: string): string {
  if (!val) return "Test SDF Network ; September 2015";
  const cleaned = val.replace(/^["']|["']$/g, "").trim();
  if (cleaned.includes("July")) {
    return "Test SDF Network ; September 2015";
  }
  return cleaned;
}

export const STELLAR_CONFIG = {
  TESTNET: {
    rpcUrl: process.env.NEXT_PUBLIC_STELLAR_RPC_URL || "https://soroban-testnet.stellar.org",
    networkPassphrase: cleanPassphrase(process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE),
    explorerUrl: "https://stellar.expert/explorer/testnet",
    // Native XLM Stellar Asset Contract on Testnet
    nativeTokenContractId: process.env.NEXT_PUBLIC_NATIVE_SAC_ADDRESS || "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    challengeContractId: process.env.NEXT_PUBLIC_CHALLENGE_CONTRACT_ID || "CCHDS5MYWM4CFUN6GMCI4J65JXKEVWDBSBV7IMD6TZILE4WI5GZC7V5A",
    escrowContractId: process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ID || "CDCK7GNCJ6BFLKOH72PFR7G4VKEZ5MO5UL46P52QSEQPZ4WUZOS46ZOQ",
  },
  STROOPS_PER_XLM: 10_000_000n,
};
