#![no_std]

pub mod storage;
pub mod types;

#[cfg(test)]
mod test;

use soroban_sdk::{
    contract, contractclient, contractimpl, symbol_short, Address, Env, String,
};
use storage::*;
use types::*;

#[contractclient(name = "EscrowContractClient")]
pub trait EscrowContractInterface {
    fn deposit(env: Env, challenge_id: u64, challenger: Address, amount: i128);
    fn release(env: Env, challenge_id: u64, recipient: Address);
    fn refund(env: Env, challenge_id: u64);
}

#[contract]
pub struct ChallengeContract;

#[contractimpl]
impl ChallengeContract {
    pub fn initialize(
        env: Env,
        admin: Address,
        escrow_contract: Address,
    ) -> Result<(), ChallengeError> {
        if is_initialized(&env) {
            return Err(ChallengeError::AlreadyInitialized);
        }
        admin.require_auth();

        set_admin(&env, &admin);
        set_escrow_contract(&env, &escrow_contract);
        set_initialized(&env);

        bump_instance(&env);
        Ok(())
    }

    pub fn get_admin(env: Env) -> Address {
        get_admin(&env)
    }

    pub fn get_escrow_contract(env: Env) -> Address {
        get_escrow_contract(&env)
    }

    pub fn get_challenge_count(env: Env) -> u64 {
        get_challenge_count(&env)
    }

    pub fn create_challenge(
        env: Env,
        challenger: Address,
        participant: Address,
        amount: i128,
        duration: u64,
        title: String,
        description: String,
        requirements: String,
    ) -> Result<u64, ChallengeError> {
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

        let challenge_id = increment_challenge_count(&env);
        let created_at = env.ledger().timestamp();

        let challenge = Challenge {
            id: challenge_id,
            challenger: challenger.clone(),
            participant: participant.clone(),
            amount,
            duration,
            deadline: 0,
            status: ChallengeStatus::Created,
            title,
            description,
            requirements,
            proof_url: String::from_str(&env, ""),
            proof_notes: String::from_str(&env, ""),
            proof_submitted_at: 0,
            created_at,
        };

        set_challenge(&env, challenge_id, &challenge);

        // Inter-contract call to Escrow contract: (challenge_id, challenger, amount)
        let escrow_addr = get_escrow_contract(&env);
        let escrow_client = EscrowContractClient::new(&env, &escrow_addr);
        escrow_client.deposit(&challenge_id, &challenger, &amount);

        env.events().publish(
            (symbol_short!("ch_create"), challenge_id),
            (challenger, participant, amount),
        );

        bump_instance(&env);
        Ok(challenge_id)
    }

    pub fn accept_challenge(
        env: Env,
        participant: Address,
        challenge_id: u64,
    ) -> Result<(), ChallengeError> {
        participant.require_auth();

        let mut challenge = get_challenge(&env, challenge_id).ok_or(ChallengeError::ChallengeNotFound)?;

        if challenge.participant != participant {
            return Err(ChallengeError::ParticipantMismatch);
        }
        if challenge.status != ChallengeStatus::Created {
            return Err(ChallengeError::InvalidState);
        }

        let current_time = env.ledger().timestamp();
        challenge.status = ChallengeStatus::Active;
        challenge.deadline = current_time + challenge.duration;

        set_challenge(&env, challenge_id, &challenge);

        env.events().publish(
            (symbol_short!("ch_active"), challenge_id),
            (participant, challenge.deadline),
        );

        bump_instance(&env);
        Ok(())
    }

    pub fn reject_challenge(
        env: Env,
        participant: Address,
        challenge_id: u64,
    ) -> Result<(), ChallengeError> {
        participant.require_auth();

        let mut challenge = get_challenge(&env, challenge_id).ok_or(ChallengeError::ChallengeNotFound)?;

        if challenge.participant != participant {
            return Err(ChallengeError::ParticipantMismatch);
        }
        if challenge.status != ChallengeStatus::Created {
            return Err(ChallengeError::InvalidState);
        }

        challenge.status = ChallengeStatus::Rejected;
        set_challenge(&env, challenge_id, &challenge);

        let escrow_addr = get_escrow_contract(&env);
        let escrow_client = EscrowContractClient::new(&env, &escrow_addr);
        escrow_client.refund(&challenge_id);

        env.events().publish(
            (symbol_short!("ch_rej"), challenge_id),
            (participant, challenge.challenger),
        );

        bump_instance(&env);
        Ok(())
    }

    pub fn cancel_challenge(
        env: Env,
        challenger: Address,
        challenge_id: u64,
    ) -> Result<(), ChallengeError> {
        challenger.require_auth();

        let mut challenge = get_challenge(&env, challenge_id).ok_or(ChallengeError::ChallengeNotFound)?;

        if challenge.challenger != challenger {
            return Err(ChallengeError::ChallengerMismatch);
        }
        if challenge.status != ChallengeStatus::Created {
            return Err(ChallengeError::InvalidState);
        }

        challenge.status = ChallengeStatus::Cancelled;
        set_challenge(&env, challenge_id, &challenge);

        let escrow_addr = get_escrow_contract(&env);
        let escrow_client = EscrowContractClient::new(&env, &escrow_addr);
        escrow_client.refund(&challenge_id);

        env.events().publish(
            (symbol_short!("ch_canc"), challenge_id),
            (challenger, challenge.amount),
        );

        bump_instance(&env);
        Ok(())
    }

    pub fn submit_proof(
        env: Env,
        participant: Address,
        challenge_id: u64,
        proof_url: String,
        notes: String,
    ) -> Result<(), ChallengeError> {
        participant.require_auth();

        let mut challenge = get_challenge(&env, challenge_id).ok_or(ChallengeError::ChallengeNotFound)?;

        if challenge.participant != participant {
            return Err(ChallengeError::ParticipantMismatch);
        }
        if challenge.status != ChallengeStatus::Active && challenge.status != ChallengeStatus::ProofRejected {
            return Err(ChallengeError::InvalidState);
        }

        let current_time = env.ledger().timestamp();
        if current_time > challenge.deadline {
            return Err(ChallengeError::DeadlinePassed);
        }

        challenge.status = ChallengeStatus::ProofSubmitted;
        challenge.proof_url = proof_url.clone();
        challenge.proof_notes = notes.clone();
        challenge.proof_submitted_at = current_time;

        set_challenge(&env, challenge_id, &challenge);

        env.events().publish(
            (symbol_short!("ch_proof"), challenge_id),
            (participant, proof_url, notes),
        );

        bump_instance(&env);
        Ok(())
    }

    pub fn resolve_challenge(
        env: Env,
        challenger: Address,
        challenge_id: u64,
        approve: bool,
    ) -> Result<(), ChallengeError> {
        challenger.require_auth();

        let mut challenge = get_challenge(&env, challenge_id).ok_or(ChallengeError::ChallengeNotFound)?;

        if challenge.challenger != challenger {
            return Err(ChallengeError::ChallengerMismatch);
        }
        if challenge.status != ChallengeStatus::ProofSubmitted {
            return Err(ChallengeError::InvalidState);
        }

        if approve {
            challenge.status = ChallengeStatus::Completed;
            set_challenge(&env, challenge_id, &challenge);

            let escrow_addr = get_escrow_contract(&env);
            let escrow_client = EscrowContractClient::new(&env, &escrow_addr);
            escrow_client.release(&challenge_id, &challenge.participant);

            env.events().publish(
                (symbol_short!("ch_done"), challenge_id),
                (challenger, challenge.participant, challenge.amount),
            );
        } else {
            challenge.status = ChallengeStatus::ProofRejected;
            set_challenge(&env, challenge_id, &challenge);

            env.events().publish(
                (symbol_short!("ch_prej"), challenge_id),
                (challenger, challenge.participant),
            );
        }

        bump_instance(&env);
        Ok(())
    }

    pub fn claim_expired_refund(
        env: Env,
        caller: Address,
        challenge_id: u64,
    ) -> Result<(), ChallengeError> {
        caller.require_auth();

        let mut challenge = get_challenge(&env, challenge_id).ok_or(ChallengeError::ChallengeNotFound)?;

        if challenge.status != ChallengeStatus::Active
            && challenge.status != ChallengeStatus::ProofSubmitted
            && challenge.status != ChallengeStatus::ProofRejected
        {
            return Err(ChallengeError::InvalidState);
        }

        let current_time = env.ledger().timestamp();
        if current_time <= challenge.deadline {
            return Err(ChallengeError::DeadlineNotPassed);
        }

        challenge.status = ChallengeStatus::Expired;
        set_challenge(&env, challenge_id, &challenge);

        let escrow_addr = get_escrow_contract(&env);
        let escrow_client = EscrowContractClient::new(&env, &escrow_addr);
        escrow_client.refund(&challenge_id);

        env.events().publish(
            (symbol_short!("ch_exp"), challenge_id),
            (caller, challenge.challenger, challenge.amount),
        );

        bump_instance(&env);
        Ok(())
    }

    pub fn get_challenge(env: Env, challenge_id: u64) -> Result<Challenge, ChallengeError> {
        get_challenge(&env, challenge_id).ok_or(ChallengeError::ChallengeNotFound)
    }

    pub fn upgrade(env: Env, new_wasm_hash: soroban_sdk::BytesN<32>) -> Result<(), ChallengeError> {
        let admin = get_admin(&env);
        admin.require_auth();

        env.deployer().update_current_contract_wasm(new_wasm_hash);
        Ok(())
    }
}
