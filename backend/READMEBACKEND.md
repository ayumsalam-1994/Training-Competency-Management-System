# TCMS Backend (Minimal Starter)

This is a minimal Express-based backend scaffold to run the Phase 1 auth functionality locally.

MySQL workbench:

double click and open mySQL connection user: root. key in password: root.
Select 'schema' (left panel). Right-click on the panel and create schema. 
name schema 'tcms'.

Quick start (PowerShell):

```powershell
cd backend
npm install
copy .env.example .env
# Edit `.env` to match your MySQL credentials (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
npm run seed-roles
npm run dev
```

Endpoints
- GET /health — basic health check
- POST /auth/register — create user, returns JWT
- POST /auth/login — sign-in, returns JWT
- GET /auth/profile — returns the user; requires Authorization header: `Bearer <token>`

Notes
- Uses MySQL (via `mysql2`) for persistence. No ORM is used — raw SQL is executed from `src/utils/db.js`.
- Ensure MySQL is running and the credentials in `.env` are correct before running `npm run seed-roles`.
- `seed-roles` will create the `roles` and `users` tables (if missing) and seed `Employee, Manager, Admin` roles.
- If you prefer to use a file DB during early development, revert `src/utils/db.js` to the previous lowdb implementation.
