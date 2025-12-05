# Qayyum — Phase 1 Step-by-Step Guide

This guide walks you through the first-phase tasks for the Competency & Certification module. It's written so you can follow it step-by-step even if you're learning as you go.

Prerequisites
- Node.js installed
- MySQL running locally
- Basic familiarity with JavaScript/TypeScript and SQL

1) Understand the current auth system (30–60 minutes)
- Open `backend/src/routes/auth.js` and read the register/login handlers. Note how `createUser` and `getUserByEmail` are used.
- Open `backend/src/utils/db.js` to see how users and roles are stored (tables, fields, helper functions).
- In the frontend, open `frontend/src/app/services/auth.ts` to see how JWTs are saved and how `user` state is derived.
- Check `frontend/src/app/guards/auth.guard.ts` to understand how protected routes are enforced.

Why: Competency/certificate endpoints must be secured and use the same auth patterns (JWT + role checks).

2) Run the app locally to explore APIs (15–30 minutes)
- Backend (new terminal):
```powershell
cd backend
npm install
copy .env.example .env
# edit .env if needed
node scripts/seedRoles.js
npm run dev
```
- Frontend (new terminal):
```powershell
cd frontend
npm install
npm start
```
- Test the manual dashboard at `http://localhost:4200/dashboard` to see sample API calls.

Why: Hands-on testing helps you observe how the auth flow works and what the API responses look like.

3) Design the competency DB schema (45–90 minutes)
- Create a simple schema draft (in a file or notes):
  - `competencies` (id, name, description, created_at, updated_at)
  - `user_competencies` (id, user_id, competency_id, level, achieved_at)
  - `certificates` (id, user_id, competency_id, issued_at, expires_at, pdf_path)
- Consider fields for metadata (issued_by, verification_code).

Why: Having the schema first makes it easier to implement endpoints and migrations.

4) Scaffold backend module (30 minutes)
- Create folder `backend/src/competencies/` with:
  - `controllers/competencyController.js`
  - `services/competencyService.js`
  - `models/` (or DB helper functions)
  - `routes.js` to register `/competencies` endpoints
- Register the new router in `backend/src/index.js` (import and `app.use('/competencies', router)`).

Why: A consistent architecture makes the module maintainable.

5) Implement placeholder endpoints (30–60 minutes)
- Add a GET `/competencies` that returns a static list of competencies (mock data).
- Add a POST `/competencies` that validates body and returns the created object (mock, no DB yet).
- Protect POST with auth middleware if you want to test role restrictions.

Why: Quick feedback loop—validate routing and auth integration before writing DB code.

6) Create simple frontend pages (30–60 minutes)
- Add a basic Angular page under `frontend/src/app/pages/competencies/` with a list view that calls `/competencies`.
- Wire a link in the navbar so you can access it easily.

Why: Frontend integration helps you verify end-to-end flow.

7) Add DB migrations and models (60–120 minutes)
- Create SQL table creation scripts in `backend/src/database/migrations` or a `scripts/` file.
- Implement DB helpers in `backend/src/utils/db.js` for CRUD operations on `competencies` and `certificates`.
- Run the migrations/seed scripts and verify the tables exist.

Why: Persistent storage is needed for real data and further features.

8) Next steps
- Implement certificate PDF generation (use a library like `pdfkit` or `puppeteer` for HTML->PDF).
- Add expiry notification cron jobs (use `node-cron` or similar).
- Build competency progress UI and admin assignment flows.

Helpful Tips
- Keep changes small and make frequent commits.
- Use the manual dashboard and `curl`/Postman to test endpoints quickly.
- Ask Hanif for specific auth patterns if something is unclear—he has the auth module context now.

Good luck! If you want, I can scaffold the backend files and add placeholder endpoints now.
