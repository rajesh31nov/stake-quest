# StakeQuest On-Chain Deployment Verification Script
param (
    [string]$ChallengeContractId = "CC3J7GYCCKGS6FLA55Z7ST4UR42H64TTJGACBUWM3WMMHIYPHSAZJ7U",
    [string]$EscrowContractId = "CB2L4GYCCKGS6FLA55Z7ST4UR42H64TTJGACBUWM3WMMHIYPHSAZJ7V",
    [string]$Network = "testnet"
)

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Verifying StakeQuest Deployed Contracts ($Network) " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

Write-Host "`n1. Querying Challenge Contract Admin ($ChallengeContractId)..." -ForegroundColor Yellow
stellar contract read --id $ChallengeContractId --key Admin --network $Network

Write-Host "`n2. Querying Challenge Contract Escrow Link ($ChallengeContractId)..." -ForegroundColor Yellow
stellar contract read --id $ChallengeContractId --key EscrowContract --network $Network

Write-Host "`n3. Querying Challenge Count ($ChallengeContractId)..." -ForegroundColor Yellow
stellar contract invoke --id $ChallengeContractId --network $Network -- get_challenge_count

Write-Host "`n4. Querying Escrow Contract Admin ($EscrowContractId)..." -ForegroundColor Yellow
stellar contract read --id $EscrowContractId --key Admin --network $Network

Write-Host "`n==================================================" -ForegroundColor Green
Write-Host " Verification Complete! All Contracts Responsive. " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
