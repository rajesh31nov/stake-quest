# StakeQuest - Decentralized Accountability & Escrow Platform

> **Production-Ready Web3 Application Built on Stellar Soroban (Level 3 Orange Belt Compliant)**

StakeQuest is a decentralised accountability and challenge platform built on the Stellar network using Soroban smart contracts. It enables users (**Challengers**) to create real-world challenges for other users (**Participants**) by staking XLM collateral into secure, automated Soroban smart contract escrows.

When a participant accepts a challenge, a real-time countdown timer begins. Upon submitting evidence of completion (GitHub link, fitness log, project URL), the Challenger reviews and approves the submission, releasing the locked XLM collateral directly to the Participant. If the proof is rejected or the deadline expires without completion, the locked XLM collateral is automatically returned to the Challenger.

---

## 🌐 Deployed Smart Contracts (Live on Stellar Testnet)

Both smart contracts have been compiled, deployed, initialized, and linked on the **Stellar Testnet**:

| Smart Contract | Deployed Contract ID | Live Explorer Link |
| :--- | :--- | :--- |
| **Challenge Contract** | `CCHDS5MYWM4CFUN6GMCI4J65JXKEVWDBSBV7IMD6TZILE4WI5GZC7V5A` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CCHDS5MYWM4CFUN6GMCI4J65JXKEVWDBSBV7IMD6TZILE4WI5GZC7V5A) |
| **Escrow Contract** | `CDCK7GNCJ6BFLKOH72PFR7G4VKEZ5MO5UL46P52QSEQPZ4WUZOS46ZOQ` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CDCK7GNCJ6BFLKOH72PFR7G4VKEZ5MO5UL46P52QSEQPZ4WUZOS46ZOQ) |
| **Native SAC Token (XLM)** | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC) |

### On-Chain Deployment Transaction Hashes

* **Escrow Contract WASM Upload**: [`188e6e7f96450c47a1e463f5454b0ffc35937b03c223349d6bd4b59691997541`](https://stellar.expert/explorer/testnet/tx/188e6e7f96450c47a1e463f5454b0ffc35937b03c223349d6bd4b59691997541)
* **Escrow Contract Deploy**: [`8bba4e9e43cefba828eb0ce0dc6c911ab7f1d6934411fd0e96e5d8b78a2fbf37`](https://stellar.expert/explorer/testnet/tx/8bba4e9e43cefba828eb0ce0dc6c911ab7f1d6934411fd0e96e5d8b78a2fbf37)
* **Escrow Contract Initialization**: [`b50589eb87ec1cb21055e1bb80eb1a851a227862f55aba9ff2b52e8fb81812fc`](https://stellar.expert/explorer/testnet/tx/b50589eb87ec1cb21055e1bb80eb1a851a227862f55aba9ff2b52e8fb81812fc)
* **Challenge Contract WASM Upload**: [`e09fb664fd10fc87343dbe3e1451b64ab53536c78e35212d9d568108596f677d`](https://stellar.expert/explorer/testnet/tx/e09fb664fd10fc87343dbe3e1451b64ab53536c78e35212d9d568108596f677d)
* **Challenge Contract Deploy**: [`dac68ffc9829b9f8de5f0267054f672f650dd65010898c5515d3aa69a87ec3c6`](https://stellar.expert/explorer/testnet/tx/dac68ffc9829b9f8de5f0267054f672f650dd65010898c5515d3aa69a87ec3c6)
* **Challenge Contract Initialization**: [`70496e1ced07cb712b357553bcc17401a493fbd26baafbff15767896a2fdfbcc`](https://stellar.expert/explorer/testnet/tx/70496e1ced07cb712b357553bcc17401a493fbd26baafbff15767896a2fdfbcc)

---

## 🚀 Key Features

* **Secure XLM Escrow Vaults**: Collateral is locked directly inside a dedicated Soroban Escrow contract until challenge criteria are met.
* **Inter-Contract Architecture**: Real contract-to-contract invocation between `stakequest-challenge` and `stakequest-escrow` smart contracts.
* **Multi-Wallet Integration**: Built with `@stellar/freighter-api` supporting wallet connect/disconnect, network switching, and balance synchronization.
* **Real-Time Event Streaming**: Soroban RPC event polling subscribes to on-chain topic emissions (`ch_create`, `ch_active`, `ch_proof`, `ch_done`, `dep_esc`, `rel_esc`, `ref_esc`).
* **Live Activity Feed**: Interactive event feed with category filter tabs (`Creations`, `Proofs`, `Payouts`, `Escrows`).
* **Production Transaction Center**: Comprehensive transaction status monitoring (`PENDING`, `PREPARING`, `SIGNING`, `SUBMITTED`, `PROCESSING`, `CONFIRMED`, `FAILED`, `EXPIRED`, `CANCELLED`) with Stellar Expert Explorer links and retry triggers.
* **Analytics & Performance Dashboard**: Aggregated user statistics, success rate percentages, completion rate progress bars, total XLM staked/earned metrics, and custom preferences.
* **Smart Contract Upgradeability**: Built-in WASM upgrade entrypoints with admin access control for seamless contract evolution.

---

## ⚡ Quick Start & Setup Instructions

### Prerequisites
1. **Rust Toolchain**: `rustc 1.80+` with target `wasm32-unknown-unknown`
2. **Node.js**: `Node.js 20+` and `npm`
3. **Stellar CLI**: `cargo install --locked stellar-cli`

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/rajesh31nov/stake-quest.git
cd stake-quest

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Run All Unit & Integration Tests

```bash
# 1. Run Soroban Smart Contract Tests (10 tests)
cargo test

# 2. Run Frontend Vitest Test Suites (37 tests across 15 files)
cd frontend
npm test
cd ..
```

### 3. Start Next.js Development Server

```bash
cd frontend
npm run dev
```



---

## 🚀 Demo Video Link of the StakeQuest (Drive Link)
Drive Link: https://drive.google.com/drive/folders/1Xr7Ihb8hOcXHjFmzGQ3kmFnLwepOFYLO

---

## 🌐 Live URL of the StakeQuest 
URL: https://stake-quest.vercel.app/

---

## 🚀 Screenshot of the dApp
### Landing Page
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/1a95c993-2d1b-4d98-bbb3-7c079721680d" />

### Dashboard
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e11d3548-b7d8-45a2-ae53-b69bdc0a9dc3" />

### Create Challenge Form
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b1817268-a321-4c6a-8990-393d94cf2d59" />

### My Challenges
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/353a413b-9461-43ee-8e0a-d50b48f3d76c" />


---

## ⚡ Deployed Smart Contracts

### 1st Deployed Contract (Challenge Contract)
- Network : Stellar Testnet
- Contract Address : CCHDS5MYWM4CFUN6GMCI4J65JXKEVWDBSBV7IMD6TZILE4WI5GZC7V5A
- Contract Explorar : https://stellar.expert/explorer/testnet/contract/CCHDS5MYWM4CFUN6GMCI4J65JXKEVWDBSBV7IMD6TZILE4WI5GZC7V5A
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f4a4703c-dc7c-46d2-bc30-92e06e8eb1d6" />

### 2nd Deployed Contract (Escrow Contract)
- Network : Stellar Testnet
- Contract Address : CDCK7GNCJ6BFLKOH72PFR7G4VKEZ5MO5UL46P52QSEQPZ4WUZOS46ZOQ
- Contract Explorar : https://stellar.expert/explorer/testnet/contract/CDCK7GNCJ6BFLKOH72PFR7G4VKEZ5MO5UL46P52QSEQPZ4WUZOS46ZOQ
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3b47d999-c15d-4594-8de8-9ee6c6a5dfe7" />


---

## 📄 License

This project is open-source software licensed under the **MIT License**.
