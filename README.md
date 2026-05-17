# GigFlow CRM

A production-ready monorepo MERN stack application.

## Prerequisites
- Node.js (v20+)
- npm (v10+)
- Docker (optional, for containerized setup)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` in both `apps/frontend` and `apps/backend` and update the values.

## Running the Application

### Development (Local)
Run both frontend and backend concurrently:
```bash
npm run dev
```

### Development (Docker)
```bash
docker-compose up --build
```

## Structure
- `apps/frontend` - React + Vite frontend
- `apps/backend` - Node.js + Express backend
- `packages/shared` - Shared TypeScript types and constants
