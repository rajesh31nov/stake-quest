use soroban_sdk::{Address, Env};
use crate::types::{Challenge, DataKey};

const DAY_IN_LEDGERS: u32 = 17280;
const INSTANCE_BUMP_AMOUNT: u32 = 30 * DAY_IN_LEDGERS;
const INSTANCE_LIFETIME_THRESHOLD: u32 = 7 * DAY_IN_LEDGERS;

const PERSISTENT_BUMP_AMOUNT: u32 = 60 * DAY_IN_LEDGERS;
const PERSISTENT_LIFETIME_THRESHOLD: u32 = 14 * DAY_IN_LEDGERS;

pub fn is_initialized(e: &Env) -> bool {
    e.storage().instance().has(&DataKey::Initialized)
}

pub fn set_initialized(e: &Env) {
    e.storage().instance().set(&DataKey::Initialized, &true);
    bump_instance(e);
}

pub fn get_admin(e: &Env) -> Address {
    bump_instance(e);
    e.storage().instance().get(&DataKey::Admin).unwrap()
}

pub fn set_admin(e: &Env, admin: &Address) {
    e.storage().instance().set(&DataKey::Admin, admin);
    bump_instance(e);
}

pub fn get_token(e: &Env) -> Address {
    bump_instance(e);
    e.storage().instance().get(&DataKey::Token).unwrap()
}

pub fn set_token(e: &Env, token: &Address) {
    e.storage().instance().set(&DataKey::Token, token);
    bump_instance(e);
}

pub fn get_escrow_contract(e: &Env) -> Address {
    bump_instance(e);
    e.storage().instance().get(&DataKey::EscrowContract).unwrap()
}

pub fn set_escrow_contract(e: &Env, escrow_contract: &Address) {
    e.storage().instance().set(&DataKey::EscrowContract, escrow_contract);
    bump_instance(e);
}

pub fn get_challenge_count(e: &Env) -> u64 {
    bump_instance(e);
    e.storage().instance().get(&DataKey::ChallengeCount).unwrap_or(0)
}

pub fn increment_challenge_count(e: &Env) -> u64 {
    let count = get_challenge_count(e) + 1;
    e.storage().instance().set(&DataKey::ChallengeCount, &count);
    bump_instance(e);
    count
}

pub fn get_challenge(e: &Env, challenge_id: u64) -> Option<Challenge> {
    let key = DataKey::Challenge(challenge_id);
    if let Some(challenge) = e.storage().persistent().get::<DataKey, Challenge>(&key) {
        e.storage().persistent().extend_ttl(&key, PERSISTENT_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT);
        Some(challenge)
    } else {
        None
    }
}

pub fn set_challenge(e: &Env, challenge_id: u64, challenge: &Challenge) {
    let key = DataKey::Challenge(challenge_id);
    e.storage().persistent().set(&key, challenge);
    e.storage().persistent().extend_ttl(&key, PERSISTENT_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT);
}

pub fn bump_instance(e: &Env) {
    e.storage().instance().extend_ttl(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);
}
