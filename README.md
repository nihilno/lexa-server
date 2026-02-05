# Lexa Invoice App – Backend

Backend API for the **Lexa Invoice App** built with Express, Prisma, and Better Auth. Provides authenticated invoice management with strict validation and controlled cross-origin access.

---

## Tech Stack

- **Runtime**: Node.js, Express 5
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Better Auth
- **Validation**: Zod
- **Security**: CORS, auth middleware, graceful shutdown
- **Tooling**: TypeScript, TSX, Prisma CLI, dotenv

---

## Request Flow

```
Client → CORS → Auth → Zod → Controllers → Prisma → PostgreSQL
```

- **CORS**: only `FRONTEND_URL` is allowed
- **Auth**: protected routes via `requireAuth`
- **Validation**: Zod validates all incoming data
- **DB Layer**: Prisma handles type-safe queries
- **Stability**: global process handlers ensure safe shutdown and DB disconnect

---

## Core Features

- Authentication & session handling (Better Auth)
- Protected invoice API (CRUD + `markAsPaid`)
- Server-side validation with Zod
- Type-safe database access with Prisma
- Robust error handling and graceful shutdown

---

## Dependencies

```json
{
  "dependencies": {
    "@prisma/adapter-pg": "^7.3.0",
    "@prisma/client": "^7.3.0",
    "better-auth": "^1.4.18",
    "cors": "^2.8.6",
    "express": "^5.2.1",
    "zod": "^4.3.6"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/node": "^25.2.0",
    "dotenv": "^17.2.3",
    "prisma": "^7.3.0",
    "tsx": "^4.21.0",
    "typescript": "^5.9.3"
  }
}
```
