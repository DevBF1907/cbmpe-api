# ---- Build Stage ----
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Dependências do sistema
RUN apk add --no-cache libc6-compat openssl

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar Prisma e fontes
COPY prisma ./prisma
COPY tsconfig*.json ./
COPY src ./src

# Gerar Prisma Client dentro do builder
RUN npx prisma generate

# Compilar o projeto
RUN npm run build


# ---- Production Stage ----
FROM node:18-alpine AS runner

WORKDIR /usr/src/app

# Criar usuário sem privilégios
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar apenas o necessário
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY package*.json ./

# 🔧 Correção: garantir permissão antes de mudar o usuário
RUN chown -R appuser:appgroup /usr/src/app

# Trocar para o usuário não root
USER appuser

EXPOSE 3000

CMD ["node", "dist/main.js"]
