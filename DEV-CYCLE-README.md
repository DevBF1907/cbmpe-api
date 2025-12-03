# 🔄 Ciclo de Desenvolvimento com Docker (Ambiente Dev)

Este guia descreve **como desenvolver, rebuildar e gerenciar a API e o banco PostgreSQL**, totalmente dentro de containers Docker.

---

## 🚀 Iniciando o Projeto

### Primeira vez (setup inicial)

Caso queira limpar o ambiente Docker antes de começar, execute:

```bash
docker system prune -f
```

Para subir todo o ambiente, utilize o comando:

```bash
docker compose up --build -d
```

---

## 🔄 Quando Rebuildar

O rebuild da imagem Docker é necessário **apenas** nos seguintes cenários:

| Cenário | Comando para Rebuild |
| :--- | :--- |
| 🧱 **1. Alterar dependências** (`package.json`) | `docker compose up --build -d` |
| 🐳 **2. Alterar o `Dockerfile`** | `docker compose up --build -d` |
| 🧬 **3. Alterar o schema do Prisma** | `docker compose up --build -d` |

Após alterar o schema do Prisma, é preciso rodar a migração:

```bash
docker exec -it cbmpe-api npx prisma migrate dev --name nome_da_migracao
```

### ⚡ Quando NÃO precisa rebuildar

Para a maioria das alterações no código-fonte, o **hot reload** é automático e um simples reinício do container é suficiente. Isto aplica-se a:

- Arquivos `.ts` dentro de `src/`
- `Controllers`, `Services`, `DTOs`
- Qualquer outra lógica de negócio

Para reiniciar o container da API manualmente:

```bash
docker compose restart cbmpe-api
```

---

## 🎯 Fluxo Prático de Desenvolvimento

1.  **Subir o ambiente:**
    ```bash
    docker compose up -d
    ```
2.  **Editar código:** O hot reload cuida do resto na maioria dos casos.
3.  **Alterou o schema do Prisma?**
    ```bash
    docker compose up --build -d
    docker exec -it cbmpe-api npx prisma migrate dev --name nome_da_migracao
    ```
4.  **Adicionou dependência ao `package.json`?**
    ```bash
    docker compose up --build -d
    ```

---

## 📋 Comandos Úteis do Dia a Dia

| Ação | Comando |
| :--- | :--- |
| **Ver status dos containers** | `docker compose ps` |
| **Ver logs gerais** | `docker compose logs -f` |
| **Logs apenas da API** | `docker logs cbmpe-api -f` |
| **Logs apenas do banco** | `docker logs cbmpe-db -f` |
| **Parar containers** | `docker compose down` |
| **Reset completo do banco (⚠️ apaga dados)** | `docker compose down -v` |

---

## 🧪 Comandos do Prisma no Container

| Ação | Comando |
| :--- | :--- |
| **Abrir Prisma Studio** | `docker exec -it cbmpe-api npx prisma studio` |
| **Rodar migrations** | `docker exec -it cbmpe-api npx prisma migrate dev` |
| **Gerar o Prisma Client** | `docker exec -it cbmpe-api npx prisma generate` |
| **Formatar schema** | `docker exec -it cbmpe-api npx prisma format` |

---

## 🐘 Banco de Dados (PostgreSQL)

Para acessar o banco de dados diretamente pelo container, utilize:

```bash
docker exec -it cbmpe-db psql -U postgres -d cbmpe
```

---

## 🌐 Serviços Disponíveis

| Serviço | URL / Porta |
| :--- | :--- |
| **API** | `http://localhost:3000` |
| **Prisma Studio** | `http://localhost:5555` |
| **PostgreSQL** | `localhost:5432` |

---

## ⚠️ Dicas Rápidas

- 90% do tempo você **não precisa rebuildar** nada.
- Se mudar dependências (`package.json`) → **rebuild obrigatório**.
- Se mudar o schema do Prisma → **rebuild + migrate**.
- Use logs para depurar: `docker logs cbmpe-api -f`.
- Para inspecionar ou alterar dados no banco, use o **Prisma Studio**.

---

## 🐛 Troubleshooting

### API não sobe

1.  Verifique os logs:
    ```bash
    docker logs cbmpe-api -f
    ```
2.  Tente reiniciar o container:
    ```bash
    docker compose restart cbmpe-api
    ```

### Banco não conecta

1.  Verifique os logs do banco:
    ```bash
    docker logs cbmpe-db -f
    ```
2.  Tente reiniciar o container:
    ```bash
    docker compose restart cbmpe-db
    ```

### Prisma não encontra o banco

Verifique se a variável de ambiente `DATABASE_URL` no seu setup está configurada para apontar para o container do Docker, e não para `localhost`:

```
postgresql://postgres:postgres@db:5432/cbmpe
```

### Reset total (último recurso)

Se nada mais funcionar, um reset completo pode resolver problemas de estado corrompido:

```bash
docker compose down -v
docker system prune -a -f
docker compose up --build -d
```
