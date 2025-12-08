# Testes E2E - Occurrence

## Problema Conhecido

Os testes e2e estão falhando com erro de autenticação do Prisma Client ao tentar conectar ao banco PostgreSQL rodando no Docker.

**Erro:**
```
PrismaClientInitializationError: Authentication failed against database server, 
the provided database credentials for `postgres` are not valid.
```

## Solução Temporária

Os testes e2e precisam que o banco de dados esteja acessível em `localhost:5432`. 

### Opção 1: Rodar os testes dentro do Docker

```bash
docker exec -it cbmpe-api npm run test:e2e
```

### Opção 2: Verificar configuração do PostgreSQL

O PostgreSQL no Docker pode não estar aceitando conexões externas. Verifique:

1. Se a porta 5432 está exposta corretamente no `docker-compose.yml`
2. Se o PostgreSQL está configurado para aceitar conexões de `localhost`
3. Se as credenciais estão corretas (postgres/postgres)

### Opção 3: Usar banco de teste separado

Configure um banco de dados de teste separado para os testes e2e.

## Status

- ✅ Estrutura dos testes criada
- ✅ Todos os casos de teste implementados
- ❌ Conexão com banco de dados falhando (problema de autenticação)

## Testes Implementados

1. ✅ Setup - Autenticação (registro e login)
2. ✅ POST /occurrences (criar, validações, autenticação)
3. ✅ GET /occurrences (listar todas, autenticação)
4. ✅ GET /occurrences/:id (buscar por ID, 404, autenticação)
5. ✅ PATCH /occurrences/:id (atualizar, 404, validações, autenticação)
6. ✅ DELETE /occurrences/:id (deletar, 404, autenticação)
7. ✅ Validação de Prioridade (BAIXA, MEDIA, ALTA, CRITICA)

