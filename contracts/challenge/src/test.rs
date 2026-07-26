#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    token::{Client as TokenClient, StellarAssetClient as TokenAdminClient},
    Address, Env, String,
};
use stakequest_escrow::EscrowContract;

fn create_token_contract<'a>(e: &Env, admin: &Address) -> (TokenClient<'a>, TokenAdminClient<'a>) {
    let sac = e.register_stellar_asset_contract_v2(admin.clone());
    (
        TokenClient::new(e, &sac.address()),
        TokenAdminClient::new(e, &sac.address()),
    )
}

struct TestSetup<'a> {
    env: Env,
    challenger: Address,
    participant: Address,
    token: TokenClient<'a>,
    escrow_id: Address,
    challenge_client: ChallengeContractClient<'a>,
}

fn setup_env<'a>() -> TestSetup<'a> {
    let env = Env::default();
    env.mock_all_auths_allowing_non_root_auth();

    let admin = Address::generate(&env);
    let challenger = Address::generate(&env);
    let participant = Address::generate(&env);

    let (token, token_admin) = create_token_contract(&env, &admin);
    token_admin.mint(&challenger, &5000);

    let escrow_id = env.register_contract(None, EscrowContract);
    let challenge_id = env.register_contract(None, ChallengeContract);

    let escrow_client = stakequest_escrow::EscrowContractClient::new(&env, &escrow_id);
    let challenge_client = ChallengeContractClient::new(&env, &challenge_id);

    escrow_client.initialize(&admin, &token.address, &challenge_id);
    challenge_client.initialize(&admin, &token.address, &escrow_id);

    TestSetup {
        env,
        challenger,
        participant,
        token,
        escrow_id,
        challenge_client,
    }
}

#[test]
fn test_full_successful_challenge_lifecycle() {
    let setup = setup_env();
    let env = &setup.env;
    let client = &setup.challenge_client;

    let title = String::from_str(env, "LeetCode 100 Mastery");
    let desc = String::from_str(env, "Solve 100 problems in 30 days");
    let reqs = String::from_str(env, "Public profile proof link");

    // 1. Challenger creates challenge (staking 1000 XLM)
    let cid = client
        .create_challenge(
            &setup.challenger,
            &setup.participant,
            &1000,
            &86400, // 1 day duration
            &title,
            &desc,
            &reqs,
        );

    assert_eq!(cid, 1);
    assert_eq!(setup.token.balance(&setup.challenger), 4000);
    assert_eq!(setup.token.balance(&setup.escrow_id), 1000);

    let ch = client.get_challenge(&cid).unwrap();
    assert_eq!(ch.status, ChallengeStatus::Created);
    assert_eq!(ch.amount, 1000);

    // 2. Participant accepts challenge
    client.accept_challenge(&setup.participant, &cid);
    let ch_active = client.get_challenge(&cid).unwrap();
    assert_eq!(ch_active.status, ChallengeStatus::Active);
    assert!(ch_active.deadline > 0);

    // 3. Participant submits proof before deadline
    let proof_url = String::from_str(env, "https://leetcode.com/user_proof");
    let proof_notes = String::from_str(env, "Completed all 100 problems successfully!");
    client.submit_proof(&setup.participant, &cid, &proof_url, &proof_notes);

    let ch_proof = client.get_challenge(&cid).unwrap();
    assert_eq!(ch_proof.status, ChallengeStatus::ProofSubmitted);
    assert_eq!(ch_proof.proof_url, proof_url);
    assert_eq!(ch_proof.proof_notes, proof_notes);

    // 4. Challenger verifies & approves proof (Payout trigger)
    client.resolve_challenge(&setup.challenger, &cid, &true);

    let ch_done = client.get_challenge(&cid).unwrap();
    assert_eq!(ch_done.status, ChallengeStatus::Completed);

    // Verify token transfers via Escrow inter-contract calls
    assert_eq!(setup.token.balance(&setup.escrow_id), 0);
    assert_eq!(setup.token.balance(&setup.participant), 1000);
    assert_eq!(setup.token.balance(&setup.challenger), 4000);
}

#[test]
fn test_challenge_rejection_and_refund() {
    let setup = setup_env();
    let env = &setup.env;
    let client = &setup.challenge_client;

    let title = String::from_str(env, "Fitness Challenge");
    let desc = String::from_str(env, "Run 5km every day");
    let reqs = String::from_str(env, "Strava logs");

    let cid = client.create_challenge(
        &setup.challenger,
        &setup.participant,
        &500,
        &86400,
        &title,
        &desc,
        &reqs,
    );

    assert_eq!(setup.token.balance(&setup.escrow_id), 500);

    // Participant rejects challenge
    client.reject_challenge(&setup.participant, &cid);

    let ch = client.get_challenge(&cid).unwrap();
    assert_eq!(ch.status, ChallengeStatus::Rejected);

    // Funds refunded to Challenger via Escrow
    assert_eq!(setup.token.balance(&setup.escrow_id), 0);
    assert_eq!(setup.token.balance(&setup.challenger), 5000);
}

#[test]
fn test_challenge_cancellation_by_challenger() {
    let setup = setup_env();
    let env = &setup.env;
    let client = &setup.challenge_client;

    let title = String::from_str(env, "Deploy Portfolio");
    let desc = String::from_str(env, "Build Next.js web application");
    let reqs = String::from_str(env, "Vercel URL");

    let cid = client.create_challenge(
        &setup.challenger,
        &setup.participant,
        &750,
        &86400,
        &title,
        &desc,
        &reqs,
    );

    // Challenger cancels before participant accepts
    client.cancel_challenge(&setup.challenger, &cid);

    let ch = client.get_challenge(&cid).unwrap();
    assert_eq!(ch.status, ChallengeStatus::Cancelled);

    assert_eq!(setup.token.balance(&setup.escrow_id), 0);
    assert_eq!(setup.token.balance(&setup.challenger), 5000);
}

#[test]
fn test_proof_rejection_and_resubmission() {
    let setup = setup_env();
    let env = &setup.env;
    let client = &setup.challenge_client;

    let title = String::from_str(env, "Rust Soroban Deep Dive");
    let desc = String::from_str(env, "Build 2 smart contracts");
    let reqs = String::from_str(env, "GitHub repo link");

    let cid = client.create_challenge(
        &setup.challenger,
        &setup.participant,
        &1200,
        &86400,
        &title,
        &desc,
        &reqs,
    );

    client.accept_challenge(&setup.participant, &cid);

    // Initial submission
    let p1_url = String::from_str(env, "https://github.com/incomplete");
    let p1_notes = String::from_str(env, "Finished contract 1");
    client.submit_proof(&setup.participant, &cid, &p1_url, &p1_notes);

    // Challenger rejects initial proof
    client.resolve_challenge(&setup.challenger, &cid, &false);
    let ch_rej = client.get_challenge(&cid).unwrap();
    assert_eq!(ch_rej.status, ChallengeStatus::ProofRejected);

    // Participant resubmits updated proof before deadline
    let p2_url = String::from_str(env, "https://github.com/complete");
    let p2_notes = String::from_str(env, "Finished both contracts!");
    client.submit_proof(&setup.participant, &cid, &p2_url, &p2_notes);
    let ch_sub2 = client.get_challenge(&cid).unwrap();
    assert_eq!(ch_sub2.status, ChallengeStatus::ProofSubmitted);
    assert_eq!(ch_sub2.proof_url, p2_url);

    // Challenger approves updated proof
    client.resolve_challenge(&setup.challenger, &cid, &true);
    let ch_final = client.get_challenge(&cid).unwrap();
    assert_eq!(ch_final.status, ChallengeStatus::Completed);
    assert_eq!(setup.token.balance(&setup.participant), 1200);
}

#[test]
fn test_expired_challenge_refund() {
    let setup = setup_env();
    let env = &setup.env;
    let client = &setup.challenge_client;

    let title = String::from_str(env, "Quick Sprint");
    let desc = String::from_str(env, "Finish task in 1 hour");
    let reqs = String::from_str(env, "Proof");

    let duration = 3600; // 1 hour
    let cid = client.create_challenge(
        &setup.challenger,
        &setup.participant,
        &600,
        &duration,
        &title,
        &desc,
        &reqs,
    );

    client.accept_challenge(&setup.participant, &cid);

    // Fast-forward time past deadline
    let current_time = env.ledger().timestamp();
    env.ledger().set_timestamp(current_time + duration + 100);

    // Claim refund after expiration
    client.claim_expired_refund(&setup.challenger, &cid);

    let ch = client.get_challenge(&cid).unwrap();
    assert_eq!(ch.status, ChallengeStatus::Expired);

    assert_eq!(setup.token.balance(&setup.escrow_id), 0);
    assert_eq!(setup.token.balance(&setup.challenger), 5000);
}

#[test]
#[should_panic]
fn test_self_challenge_fails() {
    let setup = setup_env();
    let env = &setup.env;
    let client = &setup.challenge_client;

    let title = String::from_str(env, "Self Challenge");
    let desc = String::from_str(env, "Invalid");
    let reqs = String::from_str(env, "Invalid");

    client.create_challenge(
        &setup.challenger,
        &setup.challenger, // Self target
        &500,
        &86400,
        &title,
        &desc,
        &reqs,
    );
}

#[test]
#[should_panic]
fn test_zero_amount_challenge_fails() {
    let setup = setup_env();
    let env = &setup.env;
    let client = &setup.challenge_client;

    let title = String::from_str(env, "Zero Amount");
    let desc = String::from_str(env, "Invalid");
    let reqs = String::from_str(env, "Invalid");

    client.create_challenge(
        &setup.challenger,
        &setup.participant,
        &0, // Zero amount
        &86400,
        &title,
        &desc,
        &reqs,
    );
}
