# easy.ticket.service

Serviço responsável pelo ciclo de vida de tickets de suporte. Faz parte do ecossistema **easy.ticket** e expõe uma API REST para criação, consulta e conclusão de tickets.

---

## Status

> 🚧 **Em desenvolvimento** — infraestrutura e domínio implementados, use cases e persistência em andamento.

| Camada | Status |
|---|---|
| Infraestrutura (Docker, .env, Prisma schema) | ✅ Pronto |
| Domínio (entidade, interface de repositório) | ✅ Pronto |
| PrismaService / DatabaseModule | ✅ Pronto |
| Use Cases (create, complete, get) | 🚧 Pendente |
| Repositório Prisma | 🚧 Pendente |
| Controller / DTOs | 🚧 Pendente (stub ativo) |
| Testes unitários | 🚧 Pendente |

---

## O que faz

Gerencia o ciclo de vida de um **ticket de suporte**:

- **Criar** um ticket vinculado a um cliente (`clientId`), com nome gerado automaticamente no formato `EAS-XXXXX` caso não seja fornecido
- **Consultar** um ticket pelo seu UUID
- **Completar** um ticket, transitando o status de `OPEN` para `COMPLETED` e registrando o `completedAt`

---

## Flow

```
Cliente HTTP
     │
     ▼
TicketController        ← recebe o request, valida o DTO, delega ao use case
     │
     ▼
Use Case                ← orquestra a regra de negócio (create / complete / get)
     │
     ▼
TicketRepository        ← interface (port) — o use case não conhece o banco
     │
     ▼
TicketPrismaRepository  ← implementação concreta via PrismaService → PostgreSQL
```

### Estados do ticket

```
OPEN ──── complete ────▶ COMPLETED
```

`completedAt` é preenchido no use case no momento da transição, não via trigger de banco.

---

## Stack

| Tecnologia | Uso |
|---|---|
| [NestJS](https://nestjs.com) | Framework HTTP |
| [Prisma](https://www.prisma.io) | ORM / migrations |
| PostgreSQL 16 | Banco de dados |
| TypeScript | Linguagem |
| Jest | Testes unitários |
| Docker | Ambiente de desenvolvimento |

---

## Pré-requisitos

- Node.js >= 20
- Yarn
- Docker e Docker Compose

---

## Como subir o projeto

### 1. Instalar dependências

```bash
yarn install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz (já existe um de exemplo):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/easy_ticket_service?schema=public"
PORT=3001
```

> A porta `5433` é usada para evitar conflito com outros serviços do ecossistema que usam `5432`.

### 3. Subir o banco de dados

```bash
docker compose -f docker-compose.dev.yml up -d
```

### 4. Rodar as migrations

```bash
npx prisma migrate dev --name init
```

### 5. Iniciar o serviço

```bash
# desenvolvimento com hot reload
yarn start:dev

# produção
yarn start:prod
```

O serviço sobe em `http://localhost:3001`.

---

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/tickets` | Cria um novo ticket |
| `GET` | `/tickets/:id` | Busca ticket por UUID |
| `PATCH` | `/tickets/:id/complete` | Conclui o ticket |

### POST /tickets

```json
{
  "clientId": "client-123",
  "name": "EAS-00001",       // opcional — gerado automaticamente se omitido
  "description": "Problema ao acessar o sistema"  // opcional
}
```

### PATCH /tickets/:id/complete

Sem body. Transita o ticket para `COMPLETED` e registra `completedAt`.

---

## Testes

```bash
# unitários
yarn test

# cobertura
yarn test:cov
```

---

## Estrutura do projeto

```
src/
├── infra/
│   └── database/
│       ├── prisma.service.ts
│       └── database.module.ts
└── modules/ticket/
    ├── domain/
    │   ├── ticket.entity.ts        ← entidade e tipo TicketStatus
    │   └── ticket.repository.ts    ← interface (port) + token de injeção
    ├── application/
    │   └── use-cases/              ← create / complete / get
    ├── infra/
    │   └── persistence/
    │       └── ticket.prisma.repository.ts
    ├── interface/
    │   ├── dto/
    │   │   └── ticket.dto.ts
    │   └── ticket.controller.ts
    └── ticket.module.ts
```
