# Qayyum — Phase 1 Notes (Implementation progress)

This file documents the minimal Phase 1 auth scaffolding that was added to the repo (not committed/pushed yet).

Files added by assistant (local):
- `backend/` — simple Express server with `/auth/register`, `/auth/login`, `/auth/profile` endpoints
- `backend/scripts/seedRoles.js` — seeds `Employee`, `Manager`, `Admin` roles into `data/db.json`
- `frontend/` — minimal static demo that calls `/health`, `/auth/register`, `/auth/login` to test integration

How to run locally (PowerShell):

1. Start backend
```powershell
cd backend
npm install
cp .env.example .env
npm run seed-roles
npm run dev
```

2. Start frontend quick server
```powershell
cd frontend
npm install
npm run start
```

Notes
- The backend uses `lowdb` (JSON file store) for simple local persistence to demo authentication flows.
- This is intentionally minimal to be an immediate proof-of-concept; we can replace `lowdb` with any RDBMS/ORM (MySQL + Sequelize or TypeORM) later.
