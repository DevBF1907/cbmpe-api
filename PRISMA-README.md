# 📘 Guia Rápido — Prisma + PostgreSQL (Ambiente com Docker)

Este projeto utiliza o **Prisma ORM** com um banco de dados **PostgreSQL**, ambos executados 100% dentro de containers Docker. Este guia centraliza as melhores práticas para gerenciar o banco de dados, migrations e o Prisma Client de forma eficiente.

---

## ⚙️ Observação Importante: Como o Prisma Client é Gerado

É fundamental entender que o **Prisma Client** é gerado dinamicamente com base no seu `schema.prisma`. Sempre que você executa um dos comandos abaixo, o client é recriado dentro do container, no diretório `node_modules/@prisma/client`:

```bash
docker exec -it cbmpe-api npx prisma generate
```

```bash
docker exec -it cbmpe-api npx prisma migrate dev
```

Isso significa que o objeto `PrismaClient` terá suas propriedades atualizadas automaticamente para refletir seus models. Por exemplo:

```typescript
class PrismaClient {
  user: {
    create(...)
    findMany(...)
    findUnique(...)
    update(...)
    delete(...)
  }
  // outros models...
}
```

> **Conclusão:** Alterou o schema → gere uma migration → o Prisma Client será atualizado automaticamente.

---

## 🚀 1. Primeira Vez no Projeto (Após Clonar)

Siga estes passos para configurar o ambiente pela primeira vez:

1.  **Suba os containers:**
    ```bash
    docker compose up --build -d
    ```

2.  **Instale as dependências (dentro do container):**
    ```bash
    docker exec -it cbmpe-api pnpm install
    ```

3.  **Aplique as migrations e gere o client:**
    ```bash
    docker exec -it cbmpe-api npx prisma migrate dev
    ```

Após esses passos, a API e o banco de dados estarão prontos e funcionando.

---

## 🛠️ 2. Criando ou Alterando Tabelas (`schema.prisma`)

Para modificar a estrutura do banco de dados:

1.  Edite o arquivo `prisma/schema.prisma`.

2.  Gere uma nova migration e aplique-a ao banco. Este comando deve ser executado **dentro do container**:
    ```bash
    docker exec -it cbmpe-api npx prisma migrate dev --name <nome_da_mudanca>
    ```
    **Exemplo:**
    ```bash
    docker exec -it cbmpe-api npx prisma migrate dev --name create_users_table
    ```

3.  Faça o commit dos arquivos alterados:
    - ✔ `prisma/schema.prisma`
    - ✔ `prisma/migrations/`

---

## 📥 3. Após um `git pull`

Se outro desenvolvedor criou uma nova migration, você só precisa aplicar as mudanças pendentes no seu ambiente local:

```bash
docker exec -it cbmpe-api npx prisma migrate dev
```

---

## 🌐 4. Ambiente de Produção

> **Atenção:** Nunca use o comando `migrate dev` em produção, pois ele não é seguro para ambientes produtivos.

Para aplicar migrations em produção, utilize:

```bash
npx prisma migrate deploy
```

Se você estiver usando containers em produção, o comando correspondente é:

```bash
docker exec -it cbmpe-api npx prisma migrate deploy
```

---

## 🧪 Comandos Úteis do Prisma (Executados no Container)

| Ação | Comando |
| :--- | :--- |
| **Abrir Prisma Studio** | `docker exec -it cbmpe-api npx prisma studio` |
| **Rodar migrations** | `docker exec -it cbmpe-api npx prisma migrate dev` |
| **Gerar Prisma Client manualmente** | `docker exec -it cbmpe-api npx prisma generate` |
| **Formatar o `schema.prisma`** | `docker exec -it cbmpe-api npx prisma format` |

---

## 🧾 Resumo Rápido

| Ambiente | Ação | Comando |
| :--- | :--- | :--- |
| **Desenvolvimento** | Criar migration | `docker exec -it cbmpe-api npx prisma migrate dev --name <nome>` |
| | Após `git pull` | `docker exec -it cbmpe-api npx prisma migrate dev` |
| | Gerar client | `docker exec -it cbmpe-api npx prisma generate` |
| **Produção** | Aplicar migrations | `docker exec -it cbmpe-api npx prisma migrate deploy` |

---

## ✅ Boas Práticas da Equipe

- **Nomeie migrations claramente:** Use nomes descritivos como `add_price_to_products` ou `create_orders_table`.
- **Nunca edite migrations antigas:** Se precisar reverter ou alterar algo, crie uma nova migration.
- **Verifique a `DATABASE_URL`:** Certifique-se de que a variável de ambiente aponta para o serviço do Docker (`db`), não para `localhost`.
  ```
  postgresql://postgres:postgres@db:5432/cbmpe
  ```
- **Execute comandos no container:** Todos os comandos do Prisma devem ser executados dentro do container da API para garantir consistência.
