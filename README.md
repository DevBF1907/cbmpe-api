# CBMPE API

API REST desenvolvida com NestJS para gestão de ocorrências, assinaturas digitais e usuários do Corpo de Bombeiros Militar de Pernambuco (CBMPE).

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando a Aplicação](#executando-a-aplicação)
- [Testes](#testes)
- [Documentação da API](#documentação-da-api)
- [Docker](#docker)
- [Estrutura de Dados](#estrutura-de-dados)

## 🎯 Sobre o Projeto

Esta API foi desenvolvida para gerenciar ocorrências do CBMPE, permitindo:
- Cadastro e autenticação de usuários (bombeiros)
- Criação e gestão de ocorrências com diferentes níveis de prioridade
- Sistema de assinaturas digitais para ocorrências
- Controle de status das ocorrências (Pendente, Em Andamento, Concluída, Cancelada)

## 🛠 Tecnologias Utilizadas

### Framework e Linguagem
- **NestJS** - Framework Node.js progressivo para construção de aplicações server-side eficientes e escaláveis
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Node.js** - Ambiente de execução JavaScript

### Banco de Dados
- **PostgreSQL** - Banco de dados relacional
- **Prisma** - ORM moderno para TypeScript e Node.js, facilitando o acesso ao banco de dados

### Autenticação e Segurança
- **JWT (JSON Web Tokens)** - Autenticação baseada em tokens
- **Passport** - Middleware de autenticação para Node.js
- **bcrypt** - Biblioteca para hash de senhas

### Validação e Documentação
- **class-validator** - Validação de DTOs usando decorators
- **class-transformer** - Transformação de objetos
- **Swagger/OpenAPI** - Documentação interativa da API

### Testes
- **Jest** - Framework de testes JavaScript
- **Supertest** - Biblioteca para testes HTTP

### Ferramentas de Desenvolvimento
- **ESLint** - Linter para JavaScript/TypeScript
- **Prettier** - Formatador de código
- **Docker** - Containerização da aplicação

## 📁 Estrutura do Projeto

```
cbmpe-api/
├── src/
│   ├── auth/                    # Módulo de autenticação
│   │   ├── dto/                 # Data Transfer Objects (login, register)
│   │   ├── types/               # Tipos TypeScript (JwtPayload)
│   │   ├── auth.controller.ts   # Controller com endpoints de autenticação
│   │   ├── auth.service.ts      # Lógica de negócio de autenticação
│   │   ├── auth.module.ts       # Módulo NestJS de autenticação
│   │   ├── jwt.strategy.ts      # Estratégia JWT do Passport
│   │   └── jwt-auth.guard.ts    # Guard para proteger rotas
│   │
│   ├── user/                    # Módulo de usuários
│   │   ├── dto/                 # DTOs de criação e atualização de usuários
│   │   ├── users.controller.ts  # Controller CRUD de usuários
│   │   ├── users.service.ts     # Lógica de negócio de usuários
│   │   └── users.module.ts      # Módulo NestJS de usuários
│   │
│   ├── occurrence/              # Módulo de ocorrências
│   │   ├── dto/                 # DTOs de criação e atualização de ocorrências
│   │   ├── occurrence.controller.ts  # Controller CRUD de ocorrências
│   │   ├── occurrence.service.ts     # Lógica de negócio de ocorrências
│   │   └── occurrence.module.ts     # Módulo NestJS de ocorrências
│   │
│   ├── signature/               # Módulo de assinaturas digitais
│   │   ├── dto/                 # DTOs de criação e atualização de assinaturas
│   │   ├── signature.controller.ts   # Controller CRUD de assinaturas
│   │   ├── signature.service.ts      # Lógica de negócio de assinaturas
│   │   └── signature.module.ts      # Módulo NestJS de assinaturas
│   │
│   ├── prisma/                  # Módulo Prisma
│   │   ├── prisma.service.ts    # Serviço para acesso ao Prisma Client
│   │   └── prisma.module.ts     # Módulo NestJS do Prisma
│   │
│   ├── app.module.ts            # Módulo raiz da aplicação
│   ├── app.controller.ts        # Controller raiz
│   ├── app.service.ts           # Serviço raiz
│   └── main.ts                  # Arquivo de entrada da aplicação
│
├── prisma/
│   └── schema.prisma            # Schema do banco de dados Prisma
│
├── test/                        # Testes E2E
│   ├── app.e2e-spec.ts          # Testes E2E da aplicação
│   ├── auth.e2e-spec.ts         # Testes E2E de autenticação
│   ├── occurrence.e2e-spec.ts   # Testes E2E de ocorrências
│   ├── signature.e2e-spec.ts    # Testes E2E de assinaturas
│   ├── user.e2e-spec.ts         # Testes E2E de usuários
│   ├── jest-e2e.json            # Configuração Jest para E2E
│   └── setup-e2e.ts             # Configuração inicial dos testes E2E
│
├── docker-compose.yml           # Configuração Docker Compose
├── Dockerfile                   # Imagem Docker da aplicação
├── .dockerignore                # Arquivos ignorados no Docker
├── tsconfig.json                # Configuração TypeScript
├── tsconfig.build.json          # Configuração TypeScript para build
├── eslint.config.mjs            # Configuração ESLint
└── package.json                 # Dependências e scripts do projeto
```

### Explicação das Estruturas

#### **Módulos NestJS**
Cada funcionalidade (auth, user, occurrence, signature) segue o padrão modular do NestJS:
- **Controller**: Define os endpoints HTTP e recebe as requisições
- **Service**: Contém a lógica de negócio e interage com o banco de dados
- **Module**: Agrupa controller, service e dependências, configurando o módulo
- **DTOs**: Objetos que definem a estrutura de dados para validação nas requisições

#### **Prisma**
- **schema.prisma**: Define os modelos do banco de dados (User, Occurrence, Signature)
- **PrismaService**: Serviço injetável que fornece acesso ao Prisma Client em toda a aplicação

#### **Guards e Strategies**
- **JwtAuthGuard**: Protege rotas que requerem autenticação
- **JwtStrategy**: Define como validar tokens JWT usando Passport

## 📦 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- PostgreSQL 15+
- Docker e Docker Compose (opcional, para desenvolvimento com containers)

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd cbmpe-api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (veja seção [Configuração](#configuração))

4. Configure o banco de dados:
```bash
# Gerar o Prisma Client
npx prisma generate

# Executar as migrações
npx prisma migrate dev

# (Opcional) Popular o banco com dados de exemplo
npx prisma db seed
```

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/cbmpe?schema=public"

# JWT
JWT_SECRET="seu-secret-jwt-super-seguro-aqui"

# Porta da aplicação
PORT=3000

# CORS (opcional, para produção)
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"
```

## ▶️ Executando a Aplicação

### Desenvolvimento
```bash
# Modo desenvolvimento com hot-reload
npm run start:dev

# Modo debug
npm run start:debug

# Modo produção
npm run start:prod
```

A aplicação estará disponível em `http://localhost:3000`

### Acessando o Prisma Studio
Para visualizar e gerenciar os dados do banco:
```bash
npx prisma studio
```
O Prisma Studio estará disponível em `http://localhost:5555`

## 🧪 Testes

```bash
# Testes unitários
npm test

# Testes em modo watch
npm run test:watch

# Testes com cobertura de código
npm run test:cov

# Testes E2E
npm run test:e2e

# Testes E2E no Docker
npm run test:e2e:docker
```

## 📚 Documentação da API

A documentação interativa da API está disponível através do Swagger quando a aplicação está rodando:

**URL**: `http://localhost:3000/api`

O Swagger permite:
- Visualizar todos os endpoints disponíveis
- Testar requisições diretamente na interface
- Ver exemplos de requisições e respostas
- Entender os schemas de dados

### Endpoints Principais

#### Autenticação
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login e obter token JWT

#### Ocorrências (requer autenticação)
- `GET /occurrences` - Listar todas as ocorrências
- `GET /occurrences/:id` - Buscar ocorrência por ID
- `POST /occurrences` - Criar nova ocorrência
- `PATCH /occurrences/:id` - Atualizar ocorrência
- `DELETE /occurrences/:id` - Deletar ocorrência

#### Usuários
- `GET /users` - Listar usuários
- `GET /users/:id` - Buscar usuário por ID
- `POST /users` - Criar usuário
- `PATCH /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Deletar usuário

#### Assinaturas (requer autenticação)
- `GET /signatures` - Listar assinaturas
- `GET /signatures/:id` - Buscar assinatura por ID
- `POST /signatures` - Criar assinatura digital
- `PATCH /signatures/:id` - Atualizar assinatura
- `DELETE /signatures/:id` - Deletar assinatura

## 🐳 Docker

### Executando com Docker Compose

O projeto inclui um `docker-compose.yml` que configura:
- **PostgreSQL**: Banco de dados
- **API**: Aplicação NestJS
- **Prisma Studio**: Interface visual do banco

```bash
# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Parar os serviços
docker-compose down

# Parar e remover volumes (cuidado: apaga os dados)
docker-compose down -v
```

### Build da Imagem Docker

```bash
# Build da imagem
docker build -t cbmpe-api .

# Executar container
docker run -p 3000:3000 --env-file .env cbmpe-api
```

## 💾 Estrutura de Dados

### User (Usuário)
- `id`: UUID único
- `nome`: Nome completo do bombeiro
- `email`: Email único
- `patente`: Patente militar (ex: Soldado, Cabo, Sargento)
- `unidade`: Unidade do CBMPE
- `senha`: Hash da senha (bcrypt)
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

### Occurrence (Ocorrência)
- `id`: UUID único
- `tipo`: Tipo da ocorrência (ex: Incêndio, Resgate)
- `endereco`: Endereço completo da ocorrência
- `prioridade`: Enum (BAIXA, MEDIA, ALTA, CRITICA)
- `descricao`: Descrição detalhada
- `status`: Enum (PENDENTE, EM_ANDAMENTO, CONCLUIDA, CANCELADA)
- `userId`: ID do usuário que criou a ocorrência
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

### Signature (Assinatura)
- `id`: UUID único
- `occurrenceId`: ID da ocorrência relacionada
- `assinatura`: String Base64 da assinatura digital
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

## 🔐 Segurança

- Senhas são hasheadas com bcrypt antes de serem armazenadas
- Rotas protegidas utilizam JWT Bearer tokens
- Validação de dados de entrada usando class-validator
- CORS configurado para permitir apenas origens autorizadas
- Variáveis sensíveis gerenciadas através de arquivo `.env`

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev      # Inicia em modo desenvolvimento
npm run start:debug    # Inicia em modo debug

# Build
npm run build          # Compila o projeto TypeScript

# Qualidade de Código
npm run lint           # Executa ESLint e corrige problemas
npm run format         # Formata código com Prettier

# Testes
npm test               # Testes unitários
npm run test:watch     # Testes em modo watch
npm run test:cov       # Testes com cobertura
npm run test:e2e       # Testes end-to-end
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e de uso interno do CBMPE.

## 👥 Autores

Equipe de Desenvolvimento CBMPE

---

Para mais informações sobre NestJS, visite [https://docs.nestjs.com](https://docs.nestjs.com)
