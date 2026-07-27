# StakeQuest Soroban Deployment & Operational Guide

This document provides step-by-step instructions for deploying, initializing, upgrading, and verifying the **StakeQuest** Soroban smart contracts on the Stellar Testnet and local environments.

---

## 1. Prerequisites

Ensure the following tooling is installed on your development system:
* **Rust**: `rustc 1.80+` with target `wasm32-unknown-unknown`
  ```bash
  rustup target add wasm32-unknown-unknown
  ```
* **Stellar CLI**: `stellar-cli 21.0.0+`
  ```bash
  cargo install --locked stellar-cli --features opt
  ```
* **Node.js**: `Node.js 20+` and `npm`

---

## 2. Deployer Account Setup

Configure a deployer keypair on Stellar Testnet and fund it using Friendbot:

```bash
# Generate keypair named 'deployer'
stellar keys generate deployer --network testnet

# Fund account via Friendbot
stellar keys fund deployer --network testnet
```

---

## 3. Automated Deployment Workflow

Run the automated deployment script from the project root directory:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-contracts.ps1 -Network testnet -SourceAccount deployer
```

### Manual Deployment Steps:

If you prefer to execute deployment steps manually:

1. **Compile WASM Binaries**:
   ```bash
   cargo build --all --target wasm32-unknown-unknown --release
   ```

2. **Deploy Escrow Contract**:
   ```bash
   stellar contract deploy \
     --wasm target/wasm32-unknown-unknown/release/stakequest_escrow.wasm \
     --source deployer \
     --network testnet
   ```

3. **Deploy Challenge Contract**:
   ```bash
   stellar contract deploy \
     --wasm target/wasm32-unknown-unknown/release/stakequest_challenge.wasm \
     --source deployer \
     --network testnet
   ```

4. **Initialize Escrow Contract**:
   ```bash
   stellar contract invoke \
     --id <ESCROW_CONTRACT_ID> \
     --source deployer \
     --network testnet \
     -- initialize \
     --admin $(stellar keys address deployer) \
     --token CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC \
     --challenge_contract <CHALLENGE_CONTRACT_ID>
   ```

5. **Initialize Challenge Contract**:
   ```bash
   stellar contract invoke \
     --id <CHALLENGE_CONTRACT_ID> \
     --source deployer \
     --network testnet \
     -- initialize \
     --admin $(stellar keys address deployer) \
     --escrow_contract <ESCROW_CONTRACT_ID>
   ```

---

## 4. Environment Variables Configuration

Copy `.env.example` to `.env.local` in `frontend/`:

```bash
cp frontend/.env.example frontend/.env.local
```

Update `frontend/.env.local` with the deployed contract IDs:

```env
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; July 2015"
NEXT_PUBLIC_CHALLENGE_CONTRACT_ID="<YOUR_CHALLENGE_CONTRACT_ID>"
NEXT_PUBLIC_ESCROW_CONTRACT_ID="<YOUR_ESCROW_CONTRACT_ID>"
NEXT_PUBLIC_NATIVE_SAC_ADDRESS="CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
NEXT_PUBLIC_STELLAR_EXPLORER_URL=https://stellar.expert/explorer/testnet
```

---

## 5. Contract Upgrade Strategy

Both `stakequest-challenge` and `stakequest-escrow` smart contracts implement the `upgrade` entrypoint:

```rust
pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) -> Result<(), Error> {
    let admin = get_admin(&env);
    admin.require_auth();
    env.deployer().update_current_contract_wasm(new_wasm_hash);
    Ok(())
}
```

### Performing an Upgrade:

To upgrade a contract instance without losing state:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\upgrade-contract.ps1 -TargetContract challenge -DeployedContractId <CHALLENGE_CONTRACT_ID> -SourceAccount deployer
```

---

## 6. Deployment Verification

Run the verification script to inspect live contract state on Stellar Testnet:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify-deployment.ps1 -ChallengeContractId <CHALLENGE_CONTRACT_ID> -EscrowContractId <ESCROW_CONTRACT_ID>
```

View on-chain transactions on Stellar Expert Explorer:
`https://stellar.expert/explorer/testnet/contract/<CONTRACT_ID>`
