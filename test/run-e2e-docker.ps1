# Script para rodar testes e2e dentro do container Docker
# Isso resolve o problema de autenticação do Prisma Client no Windows

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "RODANDO TESTES E2E NO DOCKER" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Verificar se o container está rodando
$containerRunning = docker ps --filter "name=cbmpe-api" --format "{{.Names}}"

if (-not $containerRunning) {
    Write-Host "❌ Container cbmpe-api não está rodando!" -ForegroundColor Red
    Write-Host "Execute: docker compose up -d" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Container encontrado: $containerRunning" -ForegroundColor Green
Write-Host "`nExecutando testes e2e...`n" -ForegroundColor Yellow

# Rodar testes dentro do container
docker exec -it cbmpe-api npm run test:e2e

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TESTES CONCLUÍDOS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

