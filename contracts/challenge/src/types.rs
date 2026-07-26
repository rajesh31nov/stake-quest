use soroban_sdk::{contracterror, contracttype, Address, String};

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum ChallengeStatus {
    Created,        // Challenger deposited funds, waiting for participant acceptance
    Active,         // Participant accepted, timer running
    ProofSubmitted, // Participant submitted proof of completion
    Completed,      // Challenger approved proof, funds released to participant
    ProofRejected,  // Challenger rejected proof (participant may resubmit before deadline)
    Cancelled,      // Challenger cancelled before participant accepted (refunded)
    Rejected,       // Participant rejected challenge before starting (refunded)
    Expired,        // Deadline passed without successful resolution (refunded to challenger)
}

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Challenge {
    pub id: u64,
    pub challenger: Address,
    pub participant: Address,
    pub amount: i128,
    pub duration: u64,       // Duration in seconds
    pub deadline: u64,       // Timestamp (0 when created, set on accept)
    pub status: ChallengeStatus,
    pub title: String,
    pub description: String,
    pub requirements: String,
    pub proof_url: String,
    pub proof_notes: String,
    pub proof_submitted_at: u64,
    pub created_at: u64,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Token,
    EscrowContract,
    Initialized,
    ChallengeCount,
    Challenge(u64),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ChallengeError {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    Unauthorized = 3,
    InvalidAmount = 4,
    InvalidDuration = 5,
    SelfChallengeNotAllowed = 6,
    ChallengeNotFound = 7,
    InvalidState = 8,
    DeadlinePassed = 9,
    DeadlineNotPassed = 10,
    ParticipantMismatch = 11,
    ChallengerMismatch = 12,
}
