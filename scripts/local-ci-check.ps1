# StakeQuest Local CI Validation Script
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Running Local StakeQuest CI Pipeline Validation  " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Smart Contract Tests
Write-Host "`n[1/4] Running Cargo Contract Tests..." -ForegroundColor Yellow
cargo test --all
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Cargo contract tests failed!" -ForegroundColor Red
    exit 1
}

# 2. WASM Compilation
Write-Host "`n[2/4] Compiling Soroban WASM Binaries..." -ForegroundColor Yellow
cargo build --all --target wasm32-unknown-unknown --release
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: WASM compilation failed!" -ForegroundColor Red
    exit 1
}

# 3. Frontend Vitest Tests
Write-Host "`n[3/4] Running Frontend Vitest Test Suites..." -ForegroundColor Yellow
Set-Location frontend
npm test
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend tests failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# 4. Next.js Production Build
Write-Host "`n[4/4] Building Next.js Production Bundle..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Next.js build failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Set-Location ..
Write-Host "`n==================================================" -ForegroundColor Green
Write-Host " SUCCESS: All Local CI Checks Passed Perfectly!  " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
