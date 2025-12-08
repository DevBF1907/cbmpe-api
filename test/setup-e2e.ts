// Setup para testes e2e - Configurar DATABASE_URL antes de qualquer importação
// IMPORTANTE: Este arquivo é executado ANTES de qualquer importação do Prisma Client

// Detectar se está rodando dentro do Docker (verificar se /usr/src/app existe)
const isDocker = require('fs').existsSync('/usr/src/app');

if (isDocker) {
  // Dentro do Docker, usar 'db:5432' (nome do serviço)
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost:5432')) {
    process.env.DATABASE_URL = 'postgresql://postgres:postgres@db:5432/cbmpe?schema=public';
  }
} else {
  // Fora do Docker (Windows), usar 'localhost:5432'
  if (process.env.DATABASE_URL?.includes('db:5432')) {
    process.env.DATABASE_URL = process.env.DATABASE_URL.replace(
      'db:5432',
      'localhost:5432',
    );
  }
  
  // Se não houver DATABASE_URL, usar a padrão para testes locais
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/cbmpe?schema=public';
  }
}

// Garantir que JWT_SECRET está configurado
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-secret-key-for-e2e-tests';
}

console.log('[E2E Setup] DATABASE_URL configurada para:', 
  process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));

