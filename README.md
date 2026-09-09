# Natarsal - Restaurant Reservation System

> Fullstack restaurant reservation system with authentication, menu management, and real-time booking.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Deployment](#deployment)

## Overview

Natarsal is a complete restaurant reservation system that allows:

- ✅ User registration and authentication (JWT)
- ✅ Browse and manage menu items
- ✅ Create and manage reservations
- ✅ Admin dashboard for restaurant management
- ✅ Role-based access control (Admin/User)

## Tech Stack

| Layer          | Technology          | Version |
| -------------- | ------------------- | ------- |
| **Frontend**   | React + TypeScript  | 18.x    |
| **Backend**    | Node.js + Express   | 20.x    |
| **Database**   | PostgreSQL + Prisma | 15.x    |
| **Testing**    | Vitest + Supertest  | Latest  |
| **Deployment** | Vercel              | -       |

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm or yarn

### Installation

```bash

# Clone repository

git clone https://github.com/username/natarsal.git
cd natarsal

# Backend setup

cd natarsal-backend
npm install
cp .env.example .env

# Setup database

npx prisma migrate dev
npx prisma db seed

# Start development server

npm run dev

# Frontend setup (another terminal)

cd ../natarsal-frontend
npm install
cp .env.example .env
npm run dev
```

## API Documentation

Once running, visit:

- Swagger UI: `http://localhost:3000/api-docs`
- Health Check: `http://localhost:3000/health`

### Main Endpoints

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| POST   | `/api/auth/register` | Register new user  |
| POST   | `/api/auth/login`    | Login user         |
| GET    | `/api/menu`          | Get menu items     |
| POST   | `/api/reservations`  | Create reservation |
| GET    | `/api/reservations`  | List reservations  |

## Environment Variables

### Backend (.env)

```env

# Application

NODE_ENV=development
PORT=3000

# Database

DATABASE_URL=postgresql://user:password@localhost:5432/natarsal

# JWT (min 32 chars!)

JWT_SECRET=your-super-secret-key-min-32-characters
REFRESH_SECRET=your-refresh-secret-min-32-characters

# Admin (Wajib di set!)

ADMIN_PASSWORD=your-strong-admin-password

# CORS

CORS_ORIGIN=http://localhost:3000

# Rate Limiting

RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
VITE_ENABLE_RESERVATION=true
```

## Testing

```bash

# Run all tests

npm test

# Run with coverage

npm run test:coverage

# Run specific test

npm test -- reservation.service.test.ts
```

## Deployment

### Deploy to Vercel (Backend)

# Install Vercel CLI

npm i -g vercel

# Deploy

cd natarsal-backend
vercel --prod

### Deploy to Vercel (Frontend)

```bash
cd natarsal-frontend
vercel --prod
```

### Required Environment Variables on Vercel

- `DATABASE_URL`
- `JWT_SECRET`
- `REFRESH_SECRET`
- `ADMIN_PASSWORD`
- `CORS_ORIGIN`

## Project Structure

natarsal/
├── natarsal-backend/
│ ├── src/
│ │ ├── config/ # Configuration
│ │ ├── controllers/ # Route controllers
│ │ ├── middleware/ # Custom middleware
│ │ ├── routes/ # API routes
│ │ ├── services/ # Business logic
│ │ ├── types/ # TypeScript types
│ │ └── utils/ # Utilities
│ ├── prisma/ # Database schema
│ ├── tests/ # Tests
│ └── api/ # Vercel entry point
├── natarsal-frontend/
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── pages/ # Page components
│ │ ├── hooks/ # Custom hooks
│ │ ├── store/ # Zustand store
│ │ └── utils/ # Utilities
│ └── public/ # Static assets
└── README.md

## 📝 License

-

- [rajul firas](https://github.com/rajul firas)
