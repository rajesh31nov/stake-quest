# StakeQuest Automated Soroban Contract Upgrade Script
param (
    [string]$TargetContract = "challenge", # 'challenge' or 'escrow'
    [string]$DeployedContractId,
    [string]$Network = "testnet",
    [string]$SourceAccount = "deployer"
)

if (-not $DeployedContractId) {
    Write-Host "ERROR: Please provide -DeployedContractId parameter!" -ForegroundColor Red
    exit 1
}

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Upgrading Soroban Contract: $TargetContract ($DeployedContractId) " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Compile WASM
Write-Host "`n[1/3] Building updated WASM binary..." -ForegroundColor Yellow
cargo build --package "stakequest-$TargetContract" --target wasm32-unknown-unknown --release

$WasmPath = "target/wasm32-unknown-unknown/release/stakequest_$TargetContract.wasm"

# 2. Install WASM to Testnet to get WASM Hash
Write-Host "`n[2/3] Installing new WASM to Stellar Testnet..." -ForegroundColor Yellow
$WasmHash = stellar contract install --wasm $WasmPath --source $SourceAccount --network $Network
if (-not $WasmHash) {
    Write-Host "ERROR: WASM installation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "-> Installed WASM Hash: $WasmHash" -ForegroundColor Green

# 3. Invoke Upgrade Method on Deployed Instance
Write-Host "`n[3/3] Invoking upgrade method on instance..." -ForegroundColor Yellow
stellar contract invoke --id $DeployedContractId --source $SourceAccount --network $Network -- upgrade --new_wasm_hash $WasmHash

Write-Host "`n==================================================" -ForegroundColor Green
Write-Host " SUCCESS: Contract $TargetContract upgraded to WASM Hash $WasmHash! " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
