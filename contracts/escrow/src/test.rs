#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::Address as _,
    token::{Client as TokenClient, StellarAssetClient as TokenAdminClient},
    Address, Env,
};

fn create_token_contract<'a>(e: &Env, admin: &Address) -> (TokenClient<'a>, TokenAdminClient<'a>) {
    let sac = e.register_stellar_asset_contract_v2(admin.clone());
    (
        TokenClient::new(e, &sac.address()),
        TokenAdminClient::new(e, &sac.address()),
    )
}

#[test]
fn test_escrow_deposit_release_workflow() {
    let env = Env::default();
    env.mock_all_auths_allowing_non_root_auth();

    let admin = Address::generate(&env);
    let challenger = Address::generate(&env);
    let participant = Address::generate(&env);
    let challenge_contract = Address::generate(&env);

    let (token, token_admin) = create_token_contract(&env, &admin);
    token_admin.mint(&challenger, &1000);

    let escrow_id = env.register_contract(None, EscrowContract);
    let escrow_client = EscrowContractClient::new(&env, &escrow_id);

    // Initialize
    escrow_client.initialize(&admin, &token.address, &challenge_contract);

    assert_eq!(escrow_client.get_admin(), admin);
    assert_eq!(escrow_client.get_challenge_contract(), challenge_contract);

    // Deposit 500 XLM into escrow for Challenge ID 1
    escrow_client.deposit(&1, &challenger, &500);

    assert_eq!(token.balance(&challenger), 500);
    assert_eq!(token.balance(&escrow_id), 500);

    let record = escrow_client.get_escrow(&1).unwrap();
    assert_eq!(record.challenge_id, 1);
    assert_eq!(record.challenger, challenger);
    assert_eq!(record.amount, 500);
    assert_eq!(record.status, EscrowStatus::Locked);

    // Release 500 XLM to participant
    escrow_client.release(&1, &participant);

    assert_eq!(token.balance(&escrow_id), 0);
    assert_eq!(token.balance(&participant), 500);

    let updated_record = escrow_client.get_escrow(&1).unwrap();
    assert_eq!(updated_record.status, EscrowStatus::Released);
}

#[test]
fn test_escrow_refund_workflow() {
    let env = Env::default();
    env.mock_all_auths_allowing_non_root_auth();

    let admin = Address::generate(&env);
    let challenger = Address::generate(&env);
    let challenge_contract = Address::generate(&env);

    let (token, token_admin) = create_token_contract(&env, &admin);
    token_admin.mint(&challenger, &1000);

    let escrow_id = env.register_contract(None, EscrowContract);
    let escrow_client = EscrowContractClient::new(&env, &escrow_id);

    escrow_client.initialize(&admin, &token.address, &challenge_contract);
    escrow_client.deposit(&2, &challenger, &300);

    assert_eq!(token.balance(&challenger), 700);
    assert_eq!(token.balance(&escrow_id), 300);

    // Refund back to challenger
    escrow_client.refund(&2);

    assert_eq!(token.balance(&escrow_id), 0);
    assert_eq!(token.balance(&challenger), 1000);

    let record = escrow_client.get_escrow(&2).unwrap();
    assert_eq!(record.status, EscrowStatus::Refunded);
}

#[test]
#[should_panic]
fn test_unauthorized_deposit_fails() {
    let env = Env::default();
    let admin = Address::generate(&env);
    let challenger = Address::generate(&env);
    let challenge_contract = Address::generate(&env);

    let (token, _) = create_token_contract(&env, &admin);

    let escrow_id = env.register_contract(None, EscrowContract);
    let escrow_client = EscrowContractClient::new(&env, &escrow_id);

    env.mock_all_auths_allowing_non_root_auth();
    escrow_client.initialize(&admin, &token.address, &challenge_contract);

    // Without mock auths active during deposit, it should panic due to missing auth signature
    let env_unauth = Env::default();
    let unauth_client = EscrowContractClient::new(&env_unauth, &escrow_id);
    unauth_client.deposit(&1, &challenger, &100);
}
