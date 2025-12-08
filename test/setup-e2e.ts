const isDocker = require('fs').existsSync('/usr/src/app');

if (isDocker) {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost:5432')) {
    process.env.DATABASE_URL = 'postgresql://postgres:postgres@db:5432/cbmpe?schema=public';
  }
} else {
  if (process.env.DATABASE_URL?.includes('db:5432')) {
    process.env.DATABASE_URL = process.env.DATABASE_URL.replace(
      'db:5432',
      'localhost:5432',
    );
  }
  
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/cbmpe?schema=public';
  }
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-secret-key-for-e2e-tests';
}

console.log('[E2E Setup] DATABASE_URL configurada para:', 
  process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));

