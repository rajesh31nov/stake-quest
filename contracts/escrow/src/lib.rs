#![no_std]

pub mod storage;
pub mod types;

#[cfg(test)]
mod test;

use soroban_sdk::{contract, contractimpl, symbol_short, Address, BytesN, Env};
use storage::*;
use types::*;

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    /// Initialize the Escrow contract with admin, token address (SAC XLM), and authorized Challenge Contract address.
    pub fn initialize(e: Env, admin: Address, token: Address, challenge_contract: Address) -> Result<(), EscrowError> {
        if is_initialized(&e) {
            return Err(EscrowError::AlreadyInitialized);
        }
        set_admin(&e, &admin);
        set_token(&e, &token);
        set_challenge_contract(&e, &challenge_contract);
        set_initialized(&e);

        e.events().publish(
            (symbol_short!("init_esc"), admin),
            (token, challenge_contract),
        );
        Ok(())
    }

    /// Deposit funds into escrow. Can ONLY be invoked by the authorized Challenge Contract.
    pub fn deposit(
        e: Env,
        challenge_id: u64,
        challenger: Address,
        amount: i128,
    ) -> Result<(), EscrowError> {
        if !is_initialized(&e) {
            return Err(EscrowError::NotInitialized);
        }

        let challenge_contract = get_challenge_contract(&e);
        challenge_contract.require_auth();

        if amount <= 0 {
            return Err(EscrowError::InvalidAmount);
        }

        let token_addr = get_token(&e);
        let token_client = soroban_sdk::token::Client::new(&e, &token_addr);

        // Transfer XLM from Challenger to this Escrow contract instance
        token_client.transfer(&challenger, &e.current_contract_address(), &amount);

        let record = EscrowRecord {
            challenge_id,
            challenger: challenger.clone(),
            amount,
            status: EscrowStatus::Locked,
        };

        set_escrow_record(&e, challenge_id, &record);

        e.events().publish(
            (symbol_short!("dep_esc"), challenge_id),
            (challenger, amount),
        );

        Ok(())
    }

    /// Release locked funds to the Participant upon challenge approval. Invoked strictly by Challenge Contract.
    pub fn release(e: Env, challenge_id: u64, recipient: Address) -> Result<(), EscrowError> {
        if !is_initialized(&e) {
            return Err(EscrowError::NotInitialized);
        }

        let challenge_contract = get_challenge_contract(&e);
        challenge_contract.require_auth();

        let mut record = get_escrow_record(&e, challenge_id).ok_or(EscrowError::EscrowNotFound)?;
        if record.status != EscrowStatus::Locked {
            return Err(EscrowError::EscrowNotLocked);
        }

        let token_addr = get_token(&e);
        let token_client = soroban_sdk::token::Client::new(&e, &token_addr);

        // Transfer XLM from Escrow to Participant
        token_client.transfer(&e.current_contract_address(), &recipient, &record.amount);

        record.status = EscrowStatus::Released;
        set_escrow_record(&e, challenge_id, &record);

        e.events().publish(
            (symbol_short!("rel_esc"), challenge_id),
            (recipient, record.amount),
        );

        Ok(())
    }

    /// Refund locked funds back to Challenger upon challenge rejection or expiration. Invoked strictly by Challenge Contract.
    pub fn refund(e: Env, challenge_id: u64) -> Result<(), EscrowError> {
        if !is_initialized(&e) {
            return Err(EscrowError::NotInitialized);
        }

        let challenge_contract = get_challenge_contract(&e);
        challenge_contract.require_auth();

        let mut record = get_escrow_record(&e, challenge_id).ok_or(EscrowError::EscrowNotFound)?;
        if record.status != EscrowStatus::Locked {
            return Err(EscrowError::EscrowNotLocked);
        }

        let token_addr = get_token(&e);
        let token_client = soroban_sdk::token::Client::new(&e, &token_addr);

        // Transfer XLM from Escrow back to Challenger
        token_client.transfer(&e.current_contract_address(), &record.challenger, &record.amount);

        record.status = EscrowStatus::Refunded;
        set_escrow_record(&e, challenge_id, &record);

        e.events().publish(
            (symbol_short!("ref_esc"), challenge_id),
            (record.challenger.clone(), record.amount),
        );

        Ok(())
    }

    /// Query escrow record status
    pub fn get_escrow(e: Env, challenge_id: u64) -> Option<EscrowRecord> {
        get_escrow_record(&e, challenge_id)
    }

    /// Query admin address
    pub fn get_admin(e: Env) -> Address {
        get_admin(&e)
    }

    /// Query linked Challenge Contract address
    pub fn get_challenge_contract(e: Env) -> Address {
        get_challenge_contract(&e)
    }

    /// Upgrade contract WASM byte code (Admin only)
    pub fn upgrade(e: Env, new_wasm_hash: BytesN<32>) -> Result<(), EscrowError> {
        let admin = get_admin(&e);
        admin.require_auth();
        e.deployer().update_current_contract_wasm(new_wasm_hash);
        Ok(())
    }
}
