# StakeQuest System Architecture & Data Flow

This document details the architectural design, component layers, data flows, and state machines powering **StakeQuest**.

---

## 1. Application Layer Architecture

StakeQuest adheres to a strict feature-based architecture ensuring complete separation of concerns between user interface rendering, React custom hooks, asynchronous services, state management stores, and blockchain contract interaction layers.

```mermaid
graph TD
    subgraph UI Layer [UI & Presentation Layer]
        Pages[Next.js App Pages /create, /received, /my-challenges, /activity, /transactions, /analytics, /settings]
        Components[UI Components ChallengeCard, SubmitProofForm, VerifyProofCard, StatCard]
    end

    subgraph Hooks Layer [React Custom Hooks Layer]
        hWallet[useWallet]
        hActions[useChallengeActions]
        hChallenges[useUserChallenges]
        hActivity[useActivityFeed]
        hTx[useTransactionCenter]
        hStats[useDashboardStats]
    end

    subgraph Service Layer [Service & Integration Layer]
        sRpc[StellarRpcService]
        sWallet[WalletKitService]
        sChallenge[ChallengeContractService]
        sEscrow[EscrowContractService]
        sEvents[EventsService]
        sAnalytics[AnalyticsService]
        sExplorer[ExplorerService]
    end

    subgraph State Layer [Zustand State Stores]
        stWallet[useWalletStore]
        stTx[useTransactionStore]
        stActivity[useActivityStore]
        stSettings[useSettingsStore]
    end

    subgraph Chain Layer [Stellar Soroban Network]
        ChallengeContract[stakequest-challenge WASM]
        EscrowContract[stakequest-escrow WASM]
        SAC[Stellar Asset Contract XLM]
        SorobanRPC[Soroban RPC Endpoint]
    end

    Pages --> Components
    Components --> hWallet & hActions & hChallenges & hActivity & hTx & hStats
    hWallet & hActions & hChallenges & hActivity & hTx & hStats --> sChallenge & sEscrow & sEvents & sAnalytics & sExplorer
    sChallenge & sEscrow & sEvents --> stWallet & stTx & stActivity & stSettings
    sChallenge & sEscrow & sEvents --> sRpc & sWallet
    sRpc & sWallet --> SorobanRPC
    SorobanRPC --> ChallengeContract & EscrowContract & SAC
```

---

## 2. Soroban Storage & Inter-Contract Architecture

### Smart Contract Storage Model

```mermaid
classDiagram
    class ChallengeContract {
        +initialize(admin, escrow_contract)
        +create_challenge(challenger, participant, amount, duration, title, description, requirements)
        +accept_challenge(participant, challenge_id)
        +reject_challenge(participant, challenge_id)
        +cancel_challenge(challenger, challenge_id)
        +submit_proof(participant, challenge_id, proof_url, notes)
        +resolve_challenge(challenger, challenge_id, approve)
        +claim_expired_refund(caller, challenge_id)
        +get_challenge(challenge_id)
        +upgrade(new_wasm_hash)
    }

    class EscrowContract {
        +initialize(admin, token, challenge_contract)
        +deposit(challenge_id, challenger, amount)
        +release(challenge_id, recipient)
        +refund(challenge_id)
        +get_escrow(challenge_id)
        +upgrade(new_wasm_hash)
    }

    class Challenge {
        +u64 id
        +Address challenger
        +Address participant
        +i128 amount
        +u64 duration
        +u64 deadline
        +ChallengeStatus status
        +String title
        +String description
        +String requirements
        +String proof_url
        +String proof_notes
        +u64 proof_submitted_at
        +u64 created_at
    }

    class EscrowRecord {
        +u64 challenge_id
        +Address challenger
        +i128 amount
        +EscrowStatus status
    }

    ChallengeContract ..> EscrowContract : Inter-Contract Call (EscrowContractClient)
    ChallengeContract --> Challenge : Persistent Storage
    EscrowContract --> EscrowRecord : Persistent Storage
```

---

## 3. Transaction Lifecycle & Status State Machine

```mermaid
stateDiagram-v2
    [*] --> PENDING : User Triggers Action
    PENDING --> PREPARING : Build Soroban Operation
    PREPARING --> SIGNING : Prompt Wallet Signature
    SIGNING --> SUBMITTED : User Signs XDR
    SUBMITTED --> PROCESSING : Send to Soroban RPC
    PROCESSING --> CONFIRMED : Tx Mined in Ledger
    PROCESSING --> FAILED : Host Error / Simulation Error
    SIGNING --> CANCELLED : User Rejects Wallet Prompt
    FAILED --> PENDING : User Triggers Retry
```

---

## 4. Real-Time Event Streaming Pipeline

```mermaid
flowchart LR
    SorobanRPC[Soroban RPC getEvents] -->|Poll Every 12s| EventsService[EventsService.fetchContractEvents]
    EventsService -->|Decode XDR Topics| Parser[parseSorobanEvent]
    Parser -->|Category Mapping| ActivityStore[useActivityStore.addEvent]
    ActivityStore -->|React Hook Subscription| ActivityFeedUI[ActivityFeedList UI]
```
