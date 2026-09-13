<div align="center">

# Natarsal — Restaurant Reservation Platform

**A production-oriented fullstack reservation system built with a free-tier-first architecture**

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge&logo=vercel)](https://natarsal-frontend.vercel.app)
[![API Status](https://img.shields.io/badge/API-healthy-brightgreen?style=for-the-badge)](https://natarsal-backend.vercel.app/api/health)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](./LICENSE)

_Self-initiated concept project — not affiliated with any real restaurant_

[Live Demo](https://natarsal-frontend.vercel.app) · [Report Bug](https://github.com/RAJULFIRAS/natarsal/issues)

</div>

---

## About This Project

**Natarsal** is a fullstack restaurant reservation system designed to handle real business workflows — from customer browsing the menu to admin managing reservations and content in real-time.

This is a **self-initiated concept project** built to demonstrate:

1. **End-to-end product engineering** — from business logic, architecture, database modeling, to deployment
2. **Cost-aware architecture** — a production-ready system that launches at **$0 infrastructure cost**, with a clear upgrade path
3. **Reference architecture** for founders and SMBs who want to go digital without committing to expensive infrastructure upfront

> **Note:** This is not client work. It is a concept project I designed and built myself as part of my portfolio.

---

## Why This Stack? — Free-Tier-First Architecture

This is a **deliberate decision**, not a constraint.

### Philosophy

Production-grade systems don't have to be expensive at the start. For MVPs, pre-seed startups, and SMBs going digital, **capital efficiency** matters more than premature scaling.

Every component in this stack:

- **Free at entry tier** — launch with $0 infrastructure cost
- **Production-ready from day one** — not a "trial version"
- **Has a clear upgrade path** — migrate when the business actually needs it
- **Modern and battle-tested** — used by unicorn startups and enterprises

### Why Not X?

| Alternative        | Why Not Chosen                                           |
| ------------------ | -------------------------------------------------------- |
| **Heroku**         | Discontinued free tier, less edge coverage               |
| **AWS (full DIY)** | Overkill for MVP, requires DevOps expertise              |
| **Firebase**       | NoSQL doesn't fit ACID reservation requirement           |
| **Supabase**       | Would work, but Vercel + Neon = better DX for this stack |

### Stack Breakdown & Upgrade Path

| Component             | Free Tier         | Paid Tier      | When to Upgrade          |
| --------------------- | ----------------- | -------------- | ------------------------ |
| **Vercel (Frontend)** | 100 GB bandwidth  | Pro $20/mo     | >100 GB or team features |
| **Vercel (Backend)**  | 100 GB-hr compute | Pro $20/mo     | High API traffic         |
| **Vercel Blob**       | 1 GB storage      | Pro $20/mo     | >1 GB image storage      |
| **Neon PostgreSQL**   | 500 MB storage    | Launch $19/mo  | >500 MB data             |
| **Total (Free)**      | **$0/month**      | —              | —                        |
| **Total (Scaled)**    | —                 | **~$59/month** | ~10,000+ active users    |

### Why This Matters

For **founders, SMBs, and early-stage startups**:

- Launch today without infrastructure commitment
- Validate business model before paying for scale
- Upgrade only when revenue justifies it
- No vendor lock-in — each component can migrate independently

**This isn't a "cheap" stack. It's a _capital-efficient_ stack** — designed to survive the transition from MVP to real business.

### Monorepo Structure

This project uses a **monorepo** for strategic reasons:

- **Shared types** between frontend & backend — consistency, fewer bugs
- **Single deploy pipeline** — Vercel auto-detects both projects
- **Centralized environment** — unified secret management
- **Easy to fork** — clients can deploy their own instance in minutes

---

## Scaling Roadmap

The system is designed to grow with the business. Here's the concrete path from MVP to enterprise.

### Stage 1 — MVP Launch (Current)

**Target:** 0–100 active users · 0–50 reservations/day

| Aspect                  | Current State                     |
| ----------------------- | --------------------------------- |
| **Infrastructure cost** | $0/month                          |
| **Hosting**             | Vercel Hobby (frontend + backend) |
| **Database**            | Neon Free (500 MB)                |
| **Storage**             | Vercel Blob Free (1 GB)           |
| **Email**               | Manual (admin sends confirmation) |
| **Monitoring**          | Vercel logs + basic health check  |
| **Expected bottleneck** | None                              |

**Action:** Launch, gather feedback, validate product-market fit.

---

### Stage 2 — Early Traction

**Target:** 100–1,000 active users · 50–500 reservations/day

| Aspect                  | Action Required                                            |
| ----------------------- | ---------------------------------------------------------- |
| **Infrastructure cost** | ~$20–40/month                                              |
| **Hosting**             | Upgrade Vercel Pro (better function limits, analytics)     |
| **Database**            | Still Neon Free (500 MB ≈ 50,000 reservation records)      |
| **Storage**             | Still Vercel Blob Free (<1 GB images)                      |
| **Email**               | Add **Resend** or **SendGrid** (free tier: 100 emails/day) |
| **Monitoring**          | Add **Sentry** (free tier) for error tracking              |
| **Analytics**           | Add Vercel Analytics or Plausible                          |
| **Expected bottleneck** | Email delivery, error visibility                           |

**Migration triggers:**

- Vercel bandwidth >80 GB/month
- Want analytics & advanced logging

**Action:** Automate email confirmations, add monitoring, tune rate limits.

---

### Stage 3 — Growth

**Target:** 1,000–10,000 active users · 500–5,000 reservations/day

| Aspect                  | Action Required                                             |
| ----------------------- | ----------------------------------------------------------- |
| **Infrastructure cost** | ~$100–200/month                                             |
| **Hosting**             | Vercel Pro + consider dedicated compute for heavy endpoints |
| **Database**            | Upgrade Neon Launch ($19/mo) → 10 GB storage, more compute  |
| **Storage**             | Upgrade Vercel Blob Pro ($20/mo) → 100 GB, 1 TB bandwidth   |
| **Email**               | Paid tier Resend/SendGrid (~$20/mo)                         |
| **Monitoring**          | Sentry Team tier + uptime monitoring (BetterStack)          |
| **Caching**             | Add Redis (Upstash free tier → paid as needed)              |
| **Search**              | Add Postgres full-text search or Meilisearch                |
| **Expected bottleneck** | Database queries, file bandwidth, concurrent reservations   |

**Migration triggers:**

- Database >400 MB
- Blob >800 MB
- API latency >500ms p95
- Concurrent reservation conflicts

**Action:** Add caching layer, optimize queries, consider read replicas.

---

### Stage 4 — Scale

**Target:** 10,000+ active users · multi-location restaurant chains

| Aspect                  | Action Required                                                                |
| ----------------------- | ------------------------------------------------------------------------------ |
| **Infrastructure cost** | $300–1,000+/month                                                              |
| **Hosting**             | Vercel Enterprise or migrate backend to dedicated infra (Railway, Fly.io, AWS) |
| **Database**            | Neon Scale or migrate to AWS RDS / Supabase Pro with read replicas             |
| **Storage**             | CDN-optimized storage (Cloudflare R2, AWS S3 + CloudFront)                     |
| **Email**               | Dedicated email service (AWS SES, Postmark)                                    |
| **Monitoring**          | Full observability stack (Datadog, Grafana, or New Relic)                      |
| **Auth**                | Consider Auth0, Clerk, or custom OAuth/OIDC                                    |
| **Payments**            | Stripe/Midtrans for deposits & prepayments                                     |
| **Search**              | Dedicated search (Algolia, Elasticsearch)                                      |
| **Expected bottleneck** | Multi-region latency, cost optimization, compliance                            |

**Migration triggers:**

- Multi-region expansion
- SLA/compliance requirements (GDPR, PCI-DSS)
- Enterprise customers demanding dedicated infrastructure

**Action:** Multi-region deployment, database sharding, dedicated support.

---

### Cost Projection

| Monthly Traffic | Active Users | Est. Cost |
| --------------- | ------------ | --------- |
| <10K            | <100         | $0        |
| 10K–100K        | 100–1K       | ~$20–40   |
| 100K–1M         | 1K–10K       | ~$100–200 |
| >1M             | 10K+         | $300+     |

---

### Scaling Principles

Whatever stage the business is in, these principles stay constant:

1. **Migrate on trigger, not on schedule** — upgrade only when a real bottleneck appears
2. **Keep components independent** — each service can be swapped without rewriting the app
3. **Measure before optimizing** — add analytics before adding infrastructure
4. **Favor managed services** — no servers to maintain until scale demands it
5. **Design for the next stage, not the final one** — architecture should support 10x growth, not 1000x

### What Doesn't Change

Even at scale, these architectural decisions stay the same:

- **TypeScript everywhere** — type safety across the stack
- **Prisma ORM** — migration history, type-safe queries
- **JWT + refresh rotation** — stateless, revocable auth
- **Zod validation** — schema-first input validation
- **REST API contract** — stable interface for clients
- **Monorepo** — shared types, unified tooling

---

## Key Features

<table>
<tr>
<td width="50%">

**For Customers**

- Interactive menu browsing by category
- Online table reservation with real-time validation
- Check reservation status via number + email
- View customer testimonials
- Multi-language (Indonesian & English)
- Fully responsive (mobile-first)

</td>
<td width="50%">

**For Admins**

- Reservation statistics dashboard
- CRUD menu + image upload to cloud storage
- CRUD testimonials with star rating
- Reservation management (approve/reject/cancel)
- Export reservation data to Excel
- JWT auth with refresh token rotation
- Protected routes with role-based access

</td>
</tr>
</table>

---

## Architecture & Engineering Decisions

```mermaid
graph TB
    subgraph Client["🖥️ Client Browser"]
        UI[React SPA]
    end

    subgraph Vercel["☁️ Vercel Edge Network"]
        FE[Frontend<br/>natarsal-frontend.vercel.app]
        BE[Backend API<br/>Serverless Functions]
        BLOB[(Vercel Blob<br/>Image Storage)]
    end

    subgraph Data["🗄️ Data Layer"]
        DB[(PostgreSQL<br/>Neon Serverless)]
    end

    UI -->|HTTPS| FE
    FE -->|REST API| BE
    BE -->|Prisma Client| DB
    BE -->|Upload / Delete| BLOB
    BLOB -.->|Public URL| UI

    style UI fill:#61DAFB,color:#000
    style FE fill:#000,color:#fff
    style BE fill:#000,color:#fff
    style BLOB fill:#FFB800,color:#000
    style DB fill:#4169E1,color:#fff
```

### Engineering Decisions

| Decision                            | Rationale                                            | Trade-off                             |
| ----------------------------------- | ---------------------------------------------------- | ------------------------------------- |
| **PostgreSQL over MongoDB**         | ACID transactions required for reservation lifecycle | Stricter schema migrations            |
| **Prisma over raw SQL**             | Type-safe queries, migration history                 | Slight overhead vs raw SQL            |
| **JWT + refresh rotation**          | Stateless auth, revocable sessions                   | Requires secure client storage        |
| **Vercel Blob over local disk**     | Serverless filesystem is ephemeral                   | Extra service dependency              |
| **Vercel Blob over S3**             | Native Vercel integration, 1-click setup             | Minor vendor lock-in                  |
| **Monorepo over multi-repo**        | Shared types, single deploy pipeline                 | Requires Vercel Root Directory config |
| **Zod over manual validation**      | Schema-first, runtime safety                         | Initial learning curve                |
| **Memory storage + Blob over disk** | Vercel filesystem is read-only                       | Requires cloud storage service        |

### Security & Production Considerations

- **Rate limiting** — 100 req/15min global, 5 req/min for auth
- **Helmet** — CSP, HSTS, frameguard, referrer policy
- **Zod validation** — all inputs validated at the boundary
- **JWT rotation** — refresh token rotated to prevent replay attacks
- **CORS whitelist** — only registered origins allowed
- **Structured logging** — error tracking with context
- **Soft delete** — data is not permanently removed
- **Integration tests** — critical paths are covered

---

## Tech Stack

<table>
<tr>
<td align="center" width="96">
<img src="https://cdn.simpleicons.org/react/61DAFB" width="48" height="48" alt="React" />
<br><sub><b>React 18</b></sub>
</td>
<td align="center" width="96">
<img src="https://cdn.simpleicons.org/typescript/3178C6" width="48" height="48" alt="TypeScript" />
<br><sub><b>TypeScript</b></sub>
</td>
<td align="center" width="96">
<img src="https://cdn.simpleicons.org/vite/646CFF" width="48" height="48" alt="Vite" />
<br><sub><b>Vite</b></sub>
</td>
<td align="center" width="96">
<img src="https://cdn.simpleicons.org/redux/764ABC" width="48" height="48" alt="Redux" />
<br><sub><b>Redux Toolkit</b></sub>
</td>
<td align="center" width="96">
<img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" width="48" height="48" alt="Tailwind" />
<br><sub><b>Tailwind CSS</b></sub>
</td>
</tr>
<tr>
<td align="center" width="96">
<img src="https://cdn.simpleicons.org/nodedotjs/339933" width="48" height="48" alt="Node.js" />
<br><sub><b>Node.js 20</b></sub>
</td>
<td align="center" width="96">
<img src="https://cdn.simpleicons.org/express/000000" width="48" height="48" alt="Express" />
<br><sub><b>Express</b></sub>
</td>
<td align="center" width="96">
<img src="https://cdn.simpleicons.org/prisma/2D3748" width="48" height="48" alt="Prisma" />
<br><sub><b>Prisma</b></sub>
</td>
<td align="center" width="96">
<img src="https://cdn.simpleicons.org/postgresql/4169E1" width="48" height="48" alt="PostgreSQL" />
<br><sub><b>PostgreSQL</b></sub>
</td>
<td align="center" width="96">
<img src="https://cdn.simpleicons.org/vercel/000000" width="48" height="48" alt="Vercel" />
<br><sub><b>Vercel</b></sub>
</td>
</tr>
</table>

**Detail:**

| Layer          | Technology                                                                             |
| -------------- | -------------------------------------------------------------------------------------- |
| **Frontend**   | React 18 · TypeScript · Vite · Redux Toolkit · React Router 6 · Tailwind CSS · i18next |
| **Backend**    | Node.js 20 · Express 4 · TypeScript · Prisma ORM · Zod · JWT · bcrypt · Multer         |
| **Database**   | PostgreSQL 15 (Neon Serverless)                                                        |
| **Storage**    | Vercel Blob (cloud file storage)                                                       |
| **Testing**    | Vitest · Supertest · Playwright · Testing Library                                      |
| **Tooling**    | ESLint · Nodemon · Rimraf                                                              |
| **Deployment** | Vercel (frontend & backend) · Neon (database) · Vercel Blob (storage)                  |

---

## Quick Start

### Prerequisites

```bash
node --version   # v20.x or newer
npm --version    # v10.x or newer
```

### 1️⃣ Clone Repository

```bash
git clone https://github.com/RAJULFIRAS/natarsal.git
cd natarsal
```

### 2️⃣ Setup Backend

```bash
cd natarsal-backend
npm install
cp .env.example .env
# Edit .env — fill DATABASE_URL, JWT_SECRET, etc.

npx prisma migrate dev
npx prisma db seed
npm run dev
```

### 3️⃣ Setup Frontend

```bash
cd ../natarsal-frontend
npm install
cp .env.example .env
# Edit .env — set VITE_API_URL=http://localhost:3001/api

npm run dev
```

### 4️⃣ Login Admin

```
Email:    admin@natarsal.com
Password: (as configured in ADMIN_PASSWORD)
```

---

## API Documentation

| Resource         | URL                              |
| ---------------- | -------------------------------- |
| **Swagger UI**   | http://localhost:3001/api-docs   |
| **Health Check** | http://localhost:3001/api/health |

### Main Endpoints

<details>
<summary><b>Public Endpoints</b></summary>

| Method | Endpoint                         | Description              |
| ------ | -------------------------------- | ------------------------ |
| `GET`  | `/api/menu`                      | List menu items          |
| `GET`  | `/api/menu/categories`           | List categories          |
| `GET`  | `/api/testimonials`              | List testimonials        |
| `POST` | `/api/reservations`              | Create reservation       |
| `GET`  | `/api/public/reservations/check` | Check reservation status |
| `POST` | `/api/auth/login`                | User login               |
| `POST` | `/api/auth/register`             | User registration        |
| `POST` | `/api/auth/refresh`              | Refresh access token     |

</details>

<details>
<summary><b>Admin Endpoints</b> (requires JWT + ADMIN role)</summary>

| Method   | Endpoint                          | Description               |
| -------- | --------------------------------- | ------------------------- |
| `GET`    | `/api/reservations`               | List all reservations     |
| `PATCH`  | `/api/reservations/:id/status`    | Update reservation status |
| `DELETE` | `/api/reservations/:id/cancel`    | Cancel reservation        |
| `POST`   | `/api/admin/menu`                 | Create menu               |
| `PUT`    | `/api/admin/menu/:id`             | Update menu               |
| `DELETE` | `/api/admin/menu/:id`             | Delete menu               |
| `POST`   | `/api/testimonials`               | Create testimonial        |
| `PUT`    | `/api/testimonials/:id`           | Update testimonial        |
| `DELETE` | `/api/testimonials/:id`           | Delete testimonial        |
| `GET`    | `/api/export/reservations/export` | Export to Excel           |

</details>

### Example Requests

**Login:**

```bash
curl -X POST https://natarsal-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@natarsal.com","password":"your-password"}'
```

**Create Reservation:**

```bash
curl -X POST https://natarsal-backend.vercel.app/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Budi Santoso",
    "customerEmail": "budi@example.com",
    "customerPhone": "081234567890",
    "date": "2025-12-25",
    "time": "19:00",
    "guests": 4
  }'
```

---

## Environment Variables

<details>
<summary><b>Backend (.env)</b></summary>

```env
# Application
NODE_ENV=development
PORT=3001

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/db?sslmode=require

# JWT — minimum 32 characters!
JWT_SECRET=your-super-secret-key-at-least-32-chars
REFRESH_SECRET=your-refresh-secret-at-least-32-chars
JWT_EXPIRY=1d
REFRESH_EXPIRY=7d

# Admin seeding
ADMIN_PASSWORD=your-strong-admin-password

# CORS
CORS_ORIGIN=http://localhost:1000,https://yourdomain.com

# Base URL
BASE_URL=http://localhost:3001

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxx
```

</details>

<details>
<summary><b>Frontend (.env)</b></summary>

```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_VERSION=1.0.0
VITE_ENABLE_RESERVATION=true
VITE_LOG_LEVEL=error
```

</details>

> ⚠️ After changing env vars on Vercel, **you must redeploy**. Vite inlines `VITE_*` at build time, not runtime.

---

## Testing

### Backend — 21 integration tests passing

| Test Suite                     | Coverage Focus                                      |
| ------------------------------ | --------------------------------------------------- |
| Authentication & Authorization | Login, register, JWT, RBAC                          |
| Menu CRUD                      | Create, update, delete, validation                  |
| Reservation Lifecycle          | Create, status check, cancellation                  |
| Security                       | Rate limiting, XSS, SQL injection, input validation |
| Smoke Tests                    | Health check, root endpoint                         |

### Frontend — 18 E2E tests across 2 browsers

| Test Suite            | User Flow                                              |
| --------------------- | ------------------------------------------------------ |
| `home.spec.ts`        | Hero section, navigation to menu/reservation           |
| `reservation.spec.ts` | Form submission, validation errors                     |
| `admin.spec.ts`       | Login, logout, invalid credentials, dashboard redirect |

**Browsers:** Chromium (desktop) + Mobile Chrome (Pixel 5 emulation)

**Plus:** Component unit tests with Vitest + Testing Library (6 tests).

### Testing Strategy

**Layered approach:**

- **Unit tests** — isolated logic, edge cases (Vitest)
- **Integration tests** — API endpoints, database, validation (Supertest)
- **E2E tests** — real user flows in real browsers (Playwright)

**Focus:** Critical paths over blanket coverage:

- Authentication boundary
- Reservation lifecycle
- Input validation (XSS, SQL injection)
- Security hardening (rate limiting)

### Run Tests

```bash
# Backend
cd natarsal-backend
npm test                    # All tests
npm run test:integration    # Integration tests only
npm run test:coverage       # With coverage report

# Frontend
cd natarsal-frontend
npm test                    # Unit tests
npm run test:e2e            # E2E tests
npm run test:e2e:ui         # E2E with UI mode
```

---

## Deployment

### Deploy Backend

```bash
cd natarsal-backend
vercel --prod
```

**Environment Variables on Vercel:**

| Variable                | Description             |
| ----------------------- | ----------------------- |
| `DATABASE_URL`          | Neon connection string  |
| `JWT_SECRET`            | Minimum 32 characters   |
| `REFRESH_SECRET`        | Minimum 32 characters   |
| `ADMIN_PASSWORD`        | Minimum 8 characters    |
| `CORS_ORIGIN`           | Production frontend URL |
| `BASE_URL`              | Production backend URL  |
| `NODE_ENV`              | `production`            |
| `BLOB_READ_WRITE_TOKEN` | From Vercel Blob        |

### Deploy Frontend

```bash
cd natarsal-frontend
vercel --prod
```

**Environment Variables:**

| Variable       | Value                                     |
| -------------- | ----------------------------------------- |
| `VITE_API_URL` | `https://natarsal-backend.vercel.app/api` |

### Setup Vercel Blob

1. **Vercel Dashboard → Project → Storage**
2. **Create Database → Blob**
3. Name: `natarsal-images`
4. Region: Singapore (`sin1`)
5. **Access: `Public`** (required for public images)
6. Token is auto-added to env vars
7. Redeploy backend

---

## Project Structure

```
natarsal/
├── 📂 natarsal-backend/
│   ├── 📂 prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   ├── 📂 src/
│   │   ├── 📂 config/         # Env, DB, security, Swagger
│   │   ├── 📂 controllers/    # Request handlers
│   │   ├── 📂 middleware/     # Auth, upload, error handler
│   │   ├── 📂 routes/         # API routes
│   │   ├── 📂 services/       # Business logic + Blob storage
│   │   ├── 📂 types/          # TypeScript types
│   │   ├── 📂 utils/          # Logger, helpers
│   │   ├── app.ts
│   │   └── index.ts
│   ├── 📂 tests/
│   └── vercel.json
│
├── 📂 natarsal-frontend/
│   ├── 📂 public/
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   ├── 📂 config/         # API client, env
│   │   ├── 📂 hooks/
│   │   ├── 📂 i18n/
│   │   ├── 📂 pages/
│   │   ├── 📂 shared/
│   │   ├── 📂 store/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── 📂 tests/e2e/
│   └── vercel.json
│
└── README.md
```

---

## Lessons Learned

Key insights from building this project:

- **Serverless ≠ traditional server** — filesystem is read-only, so cloud storage (Vercel Blob) is required for file uploads
- **CORS needs `credentials: true`** when using cookies/auth headers — `origin: "*"` won't work
- **Vite inlines env vars at build time** — not runtime, so a redeploy is required when they change
- **JWT refresh tokens** should be rotated for maximum security
- **Prisma schema is the single source of truth** — always run `migrate dev` after schema changes
- **Production testing ≠ local testing** — many bugs only appear in production
- **Cost-aware architecture** — pick free tier for MVP, prepare upgrade path for scale

---

## Roadmap

- [x] Landing page with menu preview
- [x] Online reservation with status check
- [x] Admin dashboard (CRUD menu, testimonials, reservations)
- [x] Image upload to Vercel Blob
- [x] Multi-language (ID/EN)
- [x] Export reservations to Excel
- [x] Auto-deploy to Vercel
- [ ] Email confirmation notifications
- [ ] WhatsApp reminder integration
- [ ] Analytics dashboard with charts
- [ ] Google Maps embed on contact page
- [ ] Accessibility audit (WCAG 2.1)

---

## License

Distributed under the **MIT License**. See [![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](./LICENSE) for details.

---

## Author

<div align="center">

**Rajul Firas**

_Software Engineer | AI-Native Product Builder_

I use AI for implementation speed, but I verify every output against my own engineering standards — architecture, security, cost, performance, testing, production readiness, and monitoring. AI accelerates the typing; I own the decisions.

[![GitHub](https://img.shields.io/badge/GitHub-RAJULFIRAS-181717?style=for-the-badge&logo=github)](https://github.com/RAJULFIRAS)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/rajul-firas/)
[![Email](https://img.shields.io/badge/Email-Contact-EA4335?style=for-the-badge&logo=gmail)](mailto:rajulviras@gmail.com)

</div>

---

<div align="center">

### If this project is useful, consider giving it a star!

_Built with engineering discipline and AI-assisted workflows_

</div>
