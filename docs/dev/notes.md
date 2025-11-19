# Development Notes

This file contains quick environment notes and guidance for local development.

Backend env variables (copy `.env.example` to `.env`):
```
PORT=4000
JWT_SECRET=supersecretkey
TOKEN_EXPIRY=1h
DB_FILE=./data/db.json
```

Frontend notes:
- `frontend/` contains a quick static demo (not full Angular). To scaffold a true Angular app, run `npx @angular/cli new frontend` and migrate the demo files.

DB notes:
- This repo uses `lowdb` for a lightweight JSON store in development. DB file path is defined in `DB_FILE`.

Running backend and frontend (PowerShell):
```powershell
# backend
cd backend
npm install
cp .env.example .env
npm run seed-roles
npm run dev

# frontend (quick static demo)
cd frontend
npm install
npm run start
```

***
