export const STELLAR_CONFIG = {
  TESTNET: {
    rpcUrl: process.env.NEXT_PUBLIC_STELLAR_RPC_URL || "https://soroban-testnet.stellar.org",
    networkPassphrase: process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || "Test SDF Network ; July 2015",
    explorerUrl: "https://stellar.expert/explorer/testnet",
    // Native XLM Stellar Asset Contract on Testnet
    nativeTokenContractId: process.env.NEXT_PUBLIC_NATIVE_TOKEN_CONTRACT || "CAS3J7GYCCKGS6FLA55Z7ST4UR42H64TTJGACBUWM3WMMHIYPHSAZJ7U",
    challengeContractId: process.env.NEXT_PUBLIC_CHALLENGE_CONTRACT_ID || "CC3J7GYCCKGS6FLA55Z7ST4UR42H64TTJGACBUWM3WMMHIYPHSAZJ7U",
    escrowContractId: process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ID || "CD3J7GYCCKGS6FLA55Z7ST4UR42H64TTJGACBUWM3WMMHIYPHSAZJ7U",
  },
  STROOPS_PER_XLM: 10_000_000n,
};
