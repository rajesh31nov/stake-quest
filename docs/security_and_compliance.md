# StakeQuest Security Practices & Orange Belt Compliance

This document outlines the security architecture, authorization enforcement, storage TTL bumping, dependency auditing, and **Stellar Ecosystem Level 3 (Orange Belt)** compliance verification for **StakeQuest**.

---

## 1. Smart Contract Access Control & Authorization

### Access Control Matrix

| Contract Function | Caller Authorization Requirement | Additional Verification Checks |
| :--- | :--- | :--- |
| `ChallengeContract::initialize` | `admin.require_auth()` | Single initialization guard (`is_initialized`) |
| `ChallengeContract::create_challenge` | `challenger.require_auth()` | Amount > 0, duration > 0, challenger != participant |
| `ChallengeContract::accept_challenge` | `participant.require_auth()` | Participant match, status == `Created` |
| `ChallengeContract::reject_challenge` | `participant.require_auth()` | Participant match, status == `Created` |
| `ChallengeContract::cancel_challenge` | `challenger.require_auth()` | Challenger match, status == `Created` |
| `ChallengeContract::submit_proof` | `participant.require_auth()` | Participant match, status in (`Active`, `ProofRejected`), deadline not passed |
| `ChallengeContract::resolve_challenge` | `challenger.require_auth()` | Challenger match, status == `ProofSubmitted` |
| `ChallengeContract::claim_expired_refund` | `caller.require_auth()` | Status in (`Active`, `ProofSubmitted`, `ProofRejected`), deadline passed |
| `EscrowContract::deposit` | `challenge_contract.require_auth()` | Restricts deposit caller strictly to linked Challenge Contract |
| `EscrowContract::release` | `challenge_contract.require_auth()` | Restricts release caller strictly to linked Challenge Contract |
| `EscrowContract::refund` | `challenge_contract.require_auth()` | Restricts refund caller strictly to linked Challenge Contract |

---

## 2. Storage Lifetime & TTL Extensions

Soroban requires contracts to extend storage entry lifetimes to prevent archival:

* **Instance Storage**: Instance settings (`Admin`, `Token`, `EscrowContract`) call `extend_ttl(7 days, 30 days)` upon every state change or query.
* **Persistent Storage**: Challenge entries (`DataKey::Challenge(id)`) and Escrow records (`DataKey::Escrow(id)`) call `extend_ttl(14 days, 60 days)` whenever retrieved or modified.

---

## 3. Secret Management & Key Safety

1. **No Committed Secret Keys**: Repository files and CI/CD pipelines use public address keypairs (`G...`, `C...`). Private seed keys (`S...`) are stored exclusively in local developer keystores or environment secrets.
2. **Automated Secret Leak Detection**: Automated CI pipeline (`.github/workflows/security_ci.yml`) runs regular regex checks for Stellar secret seed patterns (`S[A-Z0-9]{55}`).

---

## 4. Stellar Ecosystem Level 3 (Orange Belt) Compliance Verification

| Requirement | Specification | Implementation Verification | Status |
| :--- | :--- | :--- | :---: |
| **Soroban Contracts** | Minimum 2 Soroban smart contracts | Implemented `stakequest-challenge` and `stakequest-escrow` crates. | **VERIFIED** |
| **Inter-Contract Invocation** | Real contract-to-contract calls | `ChallengeContract` invokes `EscrowContractClient::deposit`, `release`, and `refund`. | **VERIFIED** |
| **Contract Events** | Event emissions for frontend subscriptions | Topics: `ch_create`, `ch_active`, `ch_proof`, `ch_done`, `ch_prej`, `ch_canc`, `ch_rej`, `ch_exp`, `dep_esc`, `rel_esc`, `ref_esc`. | **VERIFIED** |
| **Wallet Integration** | Multi-wallet Freighter support | Implemented `@stellar/freighter-api` integration with connect/disconnect and account switching. | **VERIFIED** |
| **Transaction UI** | Transaction status monitoring | Implemented Transaction Center supporting all 9 states with retry actions and Stellar Expert links. | **VERIFIED** |
| **Frontend Architecture** | Modern Web App (Next.js 15, TypeScript, TailwindCSS) | Built with Next.js 15 App Router, TypeScript, TailwindCSS, Zustand, and TanStack React Query. | **VERIFIED** |
| **Testing Suite** | Automated contract & frontend testing | 10 Rust unit/integration tests + 37 Vitest tests across 15 test files (100% green). | **VERIFIED** |
| **CI/CD Infrastructure** | GitHub Actions workflows | 5 production workflows (`contracts_ci`, `frontend_ci`, `pull_request`, `security_ci`, `full_pipeline`). | **VERIFIED** |
| **Deployment Automation** | Scripted testnet deployment & initialization | Automated PowerShell deployment and upgrade scripts (`deploy-contracts.ps1`, `upgrade-contract.ps1`). | **VERIFIED** |
| **Documentation** | Production-ready documentation | Complete `README.md`, `architecture.md`, `security_and_compliance.md`, and `deployment_guide.md`. | **VERIFIED** |
