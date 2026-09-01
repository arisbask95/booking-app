# BookIt — Resource Booking Prototype

A prototype booking system (rooms / desks / any bookable resource) built to
demonstrate DDD-flavoured layered architecture, a REST API with JWT
auth/roles, and a React frontend.


| Requirements|
|---|---|
| Domain Model (DDD) | `backend/prisma/schema.prisma` (User / Resource / Booking) + `backend/src/domain/TimeSlot.js` (value object με το core business rule) |
| ΒΔ από το μοντέλο | PostgreSQL, δημιουργείται από το Prisma schema (`docker compose up` το κάνει αυτόματα) |
| Layered architecture (Repository / Service / Controller) | `backend/src/repositories/`, `backend/src/services/`, `backend/src/controllers/`, `backend/src/routes/` |
| REST API | Express, βλ. `backend/src/routes/` — endpoints λίστα παρακάτω |
| React frontend | `frontend/src/` (Vite + React Router) |
| Authentication / Authorization (backend) | JWT — `backend/src/services/authService.js`, `backend/src/middleware/auth.js` (`requireAuth`, `requireRole`) |
| Authentication / Authorization (frontend) | `frontend/src/context/AuthContext.jsx`, `frontend/src/components/ProtectedRoute.jsx` |
| Swagger documentation | `backend/src/config/swagger.js` + JSDoc annotations στα routes — UI στο `/api-docs` |
| Unit tests | `backend/tests/timeSlot.test.js` (Jest) — `npm test` |
| Docker | `docker-compose.yml` (Postgres + backend) |

## Architecture

**Domain model** (`backend/src/domain/`, `backend/prisma/schema.prisma`)
- `User` (ADMIN / CUSTOMER)
- `Resource` (the bookable thing — room, desk, etc.)
- `Booking` — aggregate root linking a User + Resource + `TimeSlot`
  (value object). Core invariant: **a Resource cannot have two overlapping
  active bookings** — enforced in `TimeSlot.overlaps()` + `bookingService.create()`,
  not in the database.

**Layers (backend/src/)**
```
routes/        -> HTTP wiring + Swagger annotations
controllers/   -> parse request / call service / shape response (no logic)
services/      -> business rules (auth, availability, overlap checking)
repositories/  -> all Prisma/DB access, hidden behind a small interface
domain/        -> framework-free business rules (TimeSlot)
middleware/    -> JWT auth (requireAuth) + role checks (requireRole)
```

**Frontend (frontend/src/)** — React + Vite, React Router, Axios, JWT stored
in localStorage and attached via an Axios interceptor. `AuthContext` exposes
`user`, `login`, `register`, `logout`. `ProtectedRoute` guards logged-in and
admin-only pages.

## Prerequisites
- Node.js 20+
- Docker + Docker Compose (for Postgres — or install Postgres yourself)

## Run it — Docker (recommended, fastest path)

```bash
docker compose up --build
```
This starts Postgres **and** the backend (which runs `prisma db push` to
create the tables from `prisma/schema.prisma`, then seeds data
automatically). API: http://localhost:4000, Swagger docs:
http://localhost:4000/api-docs

Then run the frontend locally (Vite dev server proxies `/api` to :4000):
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Open http://localhost:5173

## Run it — fully local (no Docker)

1. Start a local Postgres and create a database, or run just the DB via Docker:
   ```bash
   docker run --name booking-db -e POSTGRES_USER=booking_user \
     -e POSTGRES_PASSWORD=booking_pass -e POSTGRES_DB=booking_db \
     -p 5432:5432 -d postgres:16-alpine
   ```
2. Backend:
   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm run prisma:migrate     # creates tables + a migration history from prisma/schema.prisma
   npm run prisma:seed        # seeds admin + customer + sample resources
   npm run dev                # http://localhost:4000
   ```
3. Frontend:
   ```bash
   cd frontend
   cp .env.example .env
   npm install
   npm run dev                # http://localhost:5173
   ```

## Seeded logins
| Role     | Email               | Password     |
|----------|----------------------|--------------|
| Admin    | admin@booking.app    | Admin123!    |
| Customer | customer@booking.app | Customer123! |

## API docs
Swagger UI: `http://localhost:4000/api-docs` (also import into Postman by
fetching `http://localhost:4000/api-docs.json` — swagger-ui-express exposes
the raw spec — or just hit the endpoints listed below directly).

Key endpoints:
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me                      (auth)
GET    /api/resources
GET    /api/resources/:id
POST   /api/resources                    (admin)
PUT    /api/resources/:id                (admin)
DELETE /api/resources/:id                (admin)
GET    /api/resources/:id/availability?date=YYYY-MM-DD
POST   /api/bookings                     (auth)
GET    /api/bookings/me                  (auth)
GET    /api/bookings                     (admin)
PATCH  /api/bookings/:id/cancel          (auth — owner or admin)
```

## Tests
```bash
cd backend
npm test
```
Runs unit tests on the `TimeSlot` value object (overlap detection is the
core domain rule, and it's pure/framework-free, so it's the highest-value
thing to unit test in this prototype).
