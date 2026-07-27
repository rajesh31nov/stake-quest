# StakeQuest Automated Soroban Contract Deployment Script
param (
    [string]$Network = "testnet",
    [string]$SourceAccount = "deployer",
    [string]$NativeSacAddress = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
)

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Deploying StakeQuest Soroban Contracts to $Network " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Build WASM Binaries
Write-Host "`n[1/5] Compiling Soroban WASM binaries..." -ForegroundColor Yellow
cargo build --all --target wasm32-unknown-unknown --release
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: WASM compilation failed!" -ForegroundColor Red
    exit 1
}

$EscrowWasm = "target/wasm32-unknown-unknown/release/stakequest_escrow.wasm"
$ChallengeWasm = "target/wasm32-unknown-unknown/release/stakequest_challenge.wasm"

# 2. Deploy Escrow Contract
Write-Host "`n[2/5] Deploying Escrow Contract instance..." -ForegroundColor Yellow
$EscrowId = stellar contract deploy --wasm $EscrowWasm --source $SourceAccount --network $Network
if (-not $EscrowId) {
    Write-Host "ERROR: Escrow deployment failed!" -ForegroundColor Red
    exit 1
}
Write-Host "-> Escrow Contract Deployed ID: $EscrowId" -ForegroundColor Green

# 3. Deploy Challenge Contract
Write-Host "`n[3/5] Deploying Challenge Contract instance..." -ForegroundColor Yellow
$ChallengeId = stellar contract deploy --wasm $ChallengeWasm --source $SourceAccount --network $Network
if (-not $ChallengeId) {
    Write-Host "ERROR: Challenge deployment failed!" -ForegroundColor Red
    exit 1
}
Write-Host "-> Challenge Contract Deployed ID: $ChallengeId" -ForegroundColor Green

# 4. Initialize Contracts & Inter-Contract Links
Write-Host "`n[4/5] Initializing Contracts on Stellar Testnet..." -ForegroundColor Yellow

$AdminAddress = stellar keys address $SourceAccount

Write-Host "-> Initializing Escrow Contract ($EscrowId)..." -ForegroundColor Yellow
stellar contract invoke --id $EscrowId --source $SourceAccount --network $Network -- initialize --admin $AdminAddress --token $NativeSacAddress --challenge_contract $ChallengeId

Write-Host "-> Initializing Challenge Contract ($ChallengeId)..." -ForegroundColor Yellow
stellar contract invoke --id $ChallengeId --source $SourceAccount --network $Network -- initialize --admin $AdminAddress --escrow_contract $EscrowId

# 5. Update Frontend Configurations
Write-Host "`n[5/5] Updating Frontend Configuration Files..." -ForegroundColor Yellow

$ConstantsPath = "frontend/utils/stellar-constants.ts"
$EnvPath = "frontend/.env.local"

if (Test-Path $EnvPath) {
    (Get-Content $EnvPath) |
        ForEach-Object { $_ -replace 'NEXT_PUBLIC_CHALLENGE_CONTRACT_ID=.*', "NEXT_PUBLIC_CHALLENGE_CONTRACT_ID=`"$ChallengeId`"" } |
        ForEach-Object { $_ -replace 'NEXT_PUBLIC_ESCROW_CONTRACT_ID=.*', "NEXT_PUBLIC_ESCROW_CONTRACT_ID=`"$EscrowId`"" } |
        Set-Content $EnvPath
    Write-Host "-> Updated $EnvPath" -ForegroundColor Green
}

Write-Host "`n==================================================" -ForegroundColor Green
Write-Host " SUCCESS: StakeQuest Contracts Deployed & Linked!  " -ForegroundColor Green
Write-Host " Escrow Contract ID:    $EscrowId " -ForegroundColor Green
Write-Host " Challenge Contract ID: $ChallengeId " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
