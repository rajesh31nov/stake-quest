#![no_std]

pub mod storage;
pub mod types;

#[cfg(test)]
mod test;

use soroban_sdk::{contract, contractimpl, symbol_short, Address, BytesN, Env, String};
use stakequest_escrow::EscrowContractClient;
use storage::*;
use types::*;

#[contract]
pub struct ChallengeContract;

#[contractimpl]
impl ChallengeContract {
    /// Initialize the Challenge Management Contract.
    pub fn initialize(
        e: Env,
        admin: Address,
        token: Address,
        escrow_contract: Address,
    ) -> Result<(), ChallengeError> {
        if is_initialized(&e) {
            return Err(ChallengeError::AlreadyInitialized);
        }
        set_admin(&e, &admin);
        set_token(&e, &token);
        set_escrow_contract(&e, &escrow_contract);
        set_initialized(&e);

        e.events().publish(
            (symbol_short!("init_ch"), admin),
            (token, escrow_contract),
        );
        Ok(())
    }

    /// Create a new challenge and deposit XLM into escrow via inter-contract call.
    pub fn create_challenge(
        e: Env,
        challenger: Address,
        participant: Address,
        amount: i128,
        duration: u64,
        title: String,
        description: String,
        requirements: String,
    ) -> Result<u64, ChallengeError> {
        if !is_initialized(&e) {
            return Err(ChallengeError::NotInitialized);
        }

        challenger.require_auth();

        if challenger == participant {
            return Err(ChallengeError::SelfChallengeNotAllowed);
        }
        if amount <= 0 {
            return Err(ChallengeError::InvalidAmount);
        }
        if duration == 0 {
            return Err(ChallengeError::InvalidDuration);
        }

        let challenge_id = increment_challenge_count(&e);

        // Execute inter-contract deposit call to Escrow contract
        let escrow_addr = get_escrow_contract(&e);
        let escrow_client = EscrowContractClient::new(&e, &escrow_addr);
        escrow_client.deposit(&challenge_id, &challenger, &amount);

        let now = e.ledger().timestamp();
        let challenge = Challenge {
            id: challenge_id,
            challenger: challenger.clone(),
            participant: participant.clone(),
            amount,
            duration,
            deadline: 0, // Set when participant accepts
            status: ChallengeStatus::Created,
            title,
            description,
            requirements,
            proof_url: String::from_str(&e, ""),
            proof_notes: String::from_str(&e, ""),
            proof_submitted_at: 0,
            created_at: now,
        };

        set_challenge(&e, challenge_id, &challenge);

        e.events().publish(
            (symbol_short!("ch_create"), challenge_id),
            (challenger, participant, amount, duration),
        );

        Ok(challenge_id)
    }

    /// Participant accepts the challenge. Starts the countdown timer.
    pub fn accept_challenge(
        e: Env,
        participant: Address,
        challenge_id: u64,
    ) -> Result<(), ChallengeError> {
        if !is_initialized(&e) {
            return Err(ChallengeError::NotInitialized);
        }

        participant.require_auth();

        let mut challenge = get_challenge(&e, challenge_id).ok_or(ChallengeError::ChallengeNotFound)?;

        if challenge.participant != participant {
            return Err(ChallengeError::ParticipantMismatch);
        }
        if challenge.status != ChallengeStatus::Created {
            return Err(ChallengeError::InvalidState);
        }

        let now = e.ledger().timestamp();
        let deadline = now + challenge.duration;

        challenge.status = ChallengeStatus::Active;
        challenge.deadline = deadline;

        set_challenge(&e, challenge_id, &challenge);

        e.events().publish(
            (symbol_short!("ch_active"), challenge_id),
            (participant, deadline),
        );

        Ok(())
    }

    /// Participant rejects the challenge before accepting. Funds are returned to Challenger via Escrow.
    pub fn reject_challenge(
        e: Env,
        participant: Address,
        challenge_id: u64,
    ) -> Result<(), ChallengeError> {
        if !is_initialized(&e) {
            return Err(ChallengeError::NotInitialized);
        }

        participant.require_auth();

        let mut challenge = get_challenge(&e, challenge_id).ok_or(ChallengeError::ChallengeNotFound)?;

        if challenge.participant != participant {
            return Err(ChallengeError::ParticipantMismatch);
        }
        if challenge.status != ChallengeStatus::Created {
            return Err(ChallengeError::InvalidState);
        }

        challenge.status = ChallengeStatus::Rejected;
        set_challenge(&e, challenge_id, &challenge);

        // Execute inter-contract refund call to Escrow contract
        let escrow_addr = get_escrow_contract(&e);
        let escrow_client = EscrowContractClient::new(&e, &escrow_addr);
        escrow_client.refund(&challenge_id);

        e.events().publish(
            (symbol_short!("ch_rej"), challenge_id),
            participant,
        );

        Ok(())
    }

    /// Challenger cancels the challenge before participant accepts. Funds returned to Challenger via Escrow.
    pub fn cancel_challenge(
        e: Env,
        challenger: Address,
        challenge_id: u64,
    ) -> Result<(), ChallengeError> {
        if !is_initialized(&e) {
            return Err(ChallengeError::NotInitialized);
        }

        challenger.require_auth();

        let mut challenge = get_challenge(&e, challenge_id).ok_or(ChallengeError::ChallengeNotFound)?;

        if challenge.challenger != challenger {
            return Err(ChallengeError::ChallengerMismatch);
        }
        if challenge.status != ChallengeStatus::Created {
            return Err(ChallengeError::InvalidState);
        }

        challenge.status = ChallengeStatus::Cancelled;
        set_challenge(&e, challenge_id, &challenge);

        // Execute inter-contract refund call to Escrow contract
        let escrow_addr = get_escrow_contract(&e);
        let escrow_client = EscrowContractClient::new(&e, &escrow_addr);
        escrow_client.refund(&challenge_id);

        e.events().publish(
            (symbol_short!("ch_canc"), challenge_id),
            challenger,
        );

        Ok(())
    }

    /// Participant submits proof of completion before deadline.
    pub fn submit_proof(
        e: Env,
        participant: Address,
        challenge_id: u64,
        proof_url: String,
        notes: String,
    ) -> Result<(), ChallengeError> {
        if !is_initialized(&e) {
            return Err(ChallengeError::NotInitialized);
        }

        participant.require_auth();

        let mut challenge = get_challenge(&e, challenge_id).ok_or(ChallengeError::ChallengeNotFound)?;

        if challenge.participant != participant {
            return Err(ChallengeError::ParticipantMismatch);
        }
        if challenge.status != ChallengeStatus::Active && challenge.status != ChallengeStatus::ProofRejected {
            return Err(ChallengeError::InvalidState);
        }

        let now = e.ledger().timestamp();
        if now > challenge.deadline {
            return Err(ChallengeError::DeadlinePassed);
        }

        challenge.status = ChallengeStatus::ProofSubmitted;
        challenge.proof_url = proof_url.clone();
        challenge.proof_notes = notes;
        challenge.proof_submitted_at = now;

        set_challenge(&e, challenge_id, &challenge);

        e.events().publish(
            (symbol_short!("ch_proof"), challenge_id),
            (participant, proof_url),
        );

        Ok(())
    }

    /// Challenger resolves the proof. If approve=true, releases funds to Participant. If approve=false, marks ProofRejected.
    pub fn resolve_challenge(
        e: Env,
        challenger: Address,
        challenge_id: u64,
        approve: bool,
    ) -> Result<(), ChallengeError> {
        if !is_initialized(&e) {
            return Err(ChallengeError::NotInitialized);
        }

        challenger.require_auth();

        let mut challenge = get_challenge(&e, challenge_id).ok_or(ChallengeError::ChallengeNotFound)?;

        if challenge.challenger != challenger {
            return Err(ChallengeError::ChallengerMismatch);
        }
        if challenge.status != ChallengeStatus::ProofSubmitted {
            return Err(ChallengeError::InvalidState);
        }

        let escrow_addr = get_escrow_contract(&e);
        let escrow_client = EscrowContractClient::new(&e, &escrow_addr);

        if approve {
            challenge.status = ChallengeStatus::Completed;
            set_challenge(&e, challenge_id, &challenge);

            // Execute inter-contract release call to Escrow contract
            escrow_client.release(&challenge_id, &challenge.participant);

            e.events().publish(
                (symbol_short!("ch_done"), challenge_id),
                (challenger, challenge.participant),
            );
        } else {
            challenge.status = ChallengeStatus::ProofRejected;
            set_challenge(&e, challenge_id, &challenge);

            e.events().publish(
                (symbol_short!("ch_prej"), challenge_id),
                challenger,
            );
        }

        Ok(())
    }

    /// Claim refund for expired challenge after deadline has passed without completion.
    pub fn claim_expired_refund(
        e: Env,
        caller: Address,
        challenge_id: u64,
    ) -> Result<(), ChallengeError> {
        if !is_initialized(&e) {
            return Err(ChallengeError::NotInitialized);
        }

        caller.require_auth();

        let mut challenge = get_challenge(&e, challenge_id).ok_or(ChallengeError::ChallengeNotFound)?;

        if challenge.status != ChallengeStatus::Active
            && challenge.status != ChallengeStatus::ProofSubmitted
            && challenge.status != ChallengeStatus::ProofRejected
        {
            return Err(ChallengeError::InvalidState);
        }

        let now = e.ledger().timestamp();
        if now <= challenge.deadline {
            return Err(ChallengeError::DeadlineNotPassed);
        }

        challenge.status = ChallengeStatus::Expired;
        set_challenge(&e, challenge_id, &challenge);

        // Inter-contract refund call to Escrow contract
        let escrow_addr = get_escrow_contract(&e);
        let escrow_client = EscrowContractClient::new(&e, &escrow_addr);
        escrow_client.refund(&challenge_id);

        e.events().publish(
            (symbol_short!("ch_exp"), challenge_id),
            (caller, challenge.challenger),
        );

        Ok(())
    }

    /// Get challenge details by ID
    pub fn get_challenge(e: Env, challenge_id: u64) -> Option<Challenge> {
        get_challenge(&e, challenge_id)
    }

    /// Get total challenge count
    pub fn get_challenge_count(e: Env) -> u64 {
        get_challenge_count(&e)
    }

    /// Get admin address
    pub fn get_admin(e: Env) -> Address {
        get_admin(&e)
    }

    /// Get Escrow contract address
    pub fn get_escrow_contract(e: Env) -> Address {
        get_escrow_contract(&e)
    }

    /// Upgrade contract WASM byte code (Admin only)
    pub fn upgrade(e: Env, new_wasm_hash: BytesN<32>) -> Result<(), ChallengeError> {
        let admin = get_admin(&e);
        admin.require_auth();
        e.deployer().update_current_contract_wasm(new_wasm_hash);
        Ok(())
    }
}
