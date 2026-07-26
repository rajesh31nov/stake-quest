use soroban_sdk::{Address, Env};
use crate::types::{DataKey, EscrowRecord};

const DAY_IN_LEDGERS: u32 = 17280; // ~5 sec per ledger = 17280 ledgers per day
const INSTANCE_BUMP_AMOUNT: u32 = 30 * DAY_IN_LEDGERS; // 30 days
const INSTANCE_LIFETIME_THRESHOLD: u32 = 7 * DAY_IN_LEDGERS; // 7 days

const PERSISTENT_BUMP_AMOUNT: u32 = 60 * DAY_IN_LEDGERS; // 60 days
const PERSISTENT_LIFETIME_THRESHOLD: u32 = 14 * DAY_IN_LEDGERS; // 14 days

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

pub fn get_challenge_contract(e: &Env) -> Address {
    bump_instance(e);
    e.storage().instance().get(&DataKey::ChallengeContract).unwrap()
}

pub fn set_challenge_contract(e: &Env, challenge_contract: &Address) {
    e.storage().instance().set(&DataKey::ChallengeContract, challenge_contract);
    bump_instance(e);
}

pub fn get_escrow_record(e: &Env, challenge_id: u64) -> Option<EscrowRecord> {
    let key = DataKey::EscrowRecord(challenge_id);
    if let Some(record) = e.storage().persistent().get::<DataKey, EscrowRecord>(&key) {
        e.storage().persistent().extend_ttl(&key, PERSISTENT_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT);
        Some(record)
    } else {
        None
    }
}

pub fn set_escrow_record(e: &Env, challenge_id: u64, record: &EscrowRecord) {
    let key = DataKey::EscrowRecord(challenge_id);
    e.storage().persistent().set(&key, record);
    e.storage().persistent().extend_ttl(&key, PERSISTENT_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT);
}

pub fn bump_instance(e: &Env) {
    e.storage().instance().extend_ttl(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);
}
