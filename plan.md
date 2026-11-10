# Plan — easy.ticket.service

## Decisões

- Postgres na porta `5433` (evita conflito com o orchestrator que usa `5432`)
- Banco: `easy_ticket_service`
- `completedAt` preenchido no use case ao mudar status para `COMPLETED` (não via trigger)
- Porta do serviço: `3001`

---

## 1. Infraestrutura

- `docker-compose.dev.yml` — Postgres `16-alpine` na porta `5433`
- `.env` com `DATABASE_URL` e `PORT=3001`

---

## 2. Dependências

- `@prisma/client` (dependency)
- `prisma` (devDependency)

---

## 3. Prisma

`prisma/schema.prisma` — model `Ticket`:

| Campo         | Tipo                  | Detalhe                              |
|---------------|-----------------------|--------------------------------------|
| `id`          | UUID (PK)             | `gen_random_uuid()`                  |
| `name`        | VARCHAR               | Gerado como `EAS-XXXXX` se não vier  |
| `description` | TEXT                  | Opcional                             |
| `clientId`    | VARCHAR               | Obrigatório                          |
| `status`      | enum `TicketStatus`   | `OPEN` \| `COMPLETED`, default `OPEN`|
| `createdAt`   | Timestamptz           | `default(now())`                     |
| `completedAt` | Timestamptz           | Nullable, preenchido no use case     |

---

## 4. Estrutura do módulo

```
src/
├── infra/
│   └── database/
│       ├── prisma.service.ts
│       └── database.module.ts
└── modules/ticket/
    ├── domain/
    │   ├── ticket.entity.ts
    │   └── ticket.repository.ts
    ├── application/
    │   └── use-cases/
    │       ├── create.ticket.use-case.ts
    │       ├── complete.ticket.use-case.ts
    │       └── get.ticket.use-case.ts
    ├── infra/
    │   └── persistence/
    │       └── ticket.prisma.repository.ts
    ├── interface/
    │   ├── dto/
    │   │   └── ticket.dto.ts
    │   └── ticket.controller.ts
    └── ticket.module.ts
```

---

## 5. Endpoints

| Método  | Rota                      | Descrição         |
|---------|---------------------------|-------------------|
| `POST`  | `/tickets`                | Criar ticket      |
| `PATCH` | `/tickets/:id/complete`   | Completar ticket  |
| `GET`   | `/tickets/:id`            | Buscar por UUID   |

---

## 6. Testes

```
src/modules/ticket/application/use-cases/__tests__/
├── create.ticket.use-case.spec.ts
│   ├── cria ticket com name fornecido
│   ├── gera name EAS-XXXXX quando não fornecido
│   └── cria ticket sem description (campo opcional)
├── complete.ticket.use-case.spec.ts
│   ├── completa ticket existente (status → COMPLETED, completedAt preenchido)
│   └── lança NotFoundException quando ticket não existe
└── get.ticket.use-case.spec.ts
    ├── retorna ticket pelo id
    └── lança NotFoundException quando ticket não existe
```
