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

3) Design the competency DB schema (45–90 minutes) ✅ COMPLETED
- ✅ Schema has been designed and documented in `backend/docs/competency-schema.md`
- Review the schema to understand:
  - `competencies` table: stores available competencies with name, description, level
  - `user_competencies` table: tracks which users achieved which competencies
  - `certificates` table: stores issued certificates with expiry dates and verification codes
  - Relationships and foreign keys between tables
  
**What you learned:** Database normalization, foreign key relationships, and how to design schemas that prevent data duplication while maintaining data integrity.

4) Scaffold backend module (30 minutes) ✅ COMPLETED
- ✅ Created folder structure `backend/src/competencies/` with:
  - `competencyService.js`: Business logic for CRUD operations
  - `competencyController.js`: HTTP request handlers
  - `competencyRoutes.js`: Routes for `/competencies` endpoints
  - `certificateRoutes.js`: Routes for `/certificates` endpoints
- ✅ Registered routes in `backend/src/index.js`

**What you learned:** MVC pattern separation (Model-View-Controller), how services encapsulate business logic, and how controllers handle HTTP concerns.

5) Implement placeholder endpoints (30–60 minutes) ✅ COMPLETED
- ✅ Implemented endpoints with mock data:
  - `GET /competencies` - List all competencies
  - `GET /competencies/:id` - Get specific competency
  - `POST /competencies` - Create new competency (admin)
  - `GET /competencies/user/:userId` - Get user's competencies
  - `GET /certificates` - Get user's certificates
  - `POST /certificates` - Issue certificate (admin)
  - `GET /certificates/:id/download` - Download PDF (not yet implemented)
- ✅ All endpoints protected by auth middleware

**Testing the endpoints:**
```powershell
# Start the backend
cd backend
npm run dev

# In another terminal, test with curl or use the frontend
# The frontend will automatically call these endpoints
```

**What you learned:** RESTful API design, HTTP methods (GET, POST), status codes, and how authentication middleware protects routes.

6) Create database migrations and seed data ✅ COMPLETED
- ✅ Created migration script: `backend/scripts/createCompetencyTables.js`
- ✅ Created seed script: `backend/scripts/seedCompetencies.js`

**Run the migrations:**
```powershell
cd backend

# Create the tables
node scripts/createCompetencyTables.js

# Seed sample competencies
node scripts/seedCompetencies.js
```

**What you learned:** Database migrations for version control of schema changes, seeding for test data, and how to write safe database initialization scripts.

7) Build frontend UI (30–60 minutes) ✅ COMPLETED
- ✅ Created `frontend/src/app/services/competency.ts` service
- ✅ Created `frontend/src/app/pages/competencies/` component with:
  - Progress overview dashboard
  - Competencies grid with achievement status
  - Certificates section with download functionality
- ✅ Added route and navbar link
- ✅ Connected to real backend endpoints (was using mock data)

**Testing the frontend:**
```powershell
cd frontend
npm start
# Navigate to http://localhost:4200/competencies
```

**What you learned:** Angular services for API calls, component design, reactive programming with RxJS Observables, and frontend-backend integration.

8) Next steps: Connect backend to real database (PHASE 2)

Now that you have the structure in place, the next phase is to replace the mock data in the service with real database queries.

**Tasks for Phase 2:**
- Update `competencyService.js` to use database queries instead of mock data
- Add DB helper functions to `backend/src/utils/db.js` similar to existing user functions
- Implement actual CRUD operations for competencies and certificates
- Add proper error handling and validation
- Test all endpoints with real data

**Example: Updating getAllCompetencies to use real DB**
```javascript
async getAllCompetencies() {
  const connection = await pool.getConnection();
  try {
    const query = 'SELECT * FROM competencies ORDER BY created_at DESC';
    const [rows] = await connection.execute(query);
    return rows;
  } finally {
    connection.release();
  }
}
```

9) Certificate PDF generation (PHASE 3+)
- Use `pdfkit` or `puppeteer` library for HTML-to-PDF conversion
- Design certificate templates with company branding
- Generate unique verification codes using crypto
- Store PDF files in `backend/uploads/certificates/` directory

10) Expiry notification system (PHASE 4+)
- Use `node-cron` to run daily checks for expiring certificates
- Query certificates where `expires_at` is within 30 days
- Send email notifications to users (integrate email service)
- Update certificate status to 'expired' when past expiry date

---

## 🎯 What You've Accomplished (Phase 1)

✅ **Backend Infrastructure:**
- Complete competency module with controllers, services, and routes
- RESTful API endpoints with authentication protection
- Database schema designed and documented
- Migration and seed scripts ready to run

✅ **Frontend Interface:**
- Professional competency dashboard with progress tracking
- Certificate management interface
- Real-time API integration
- Responsive design with modern UI

✅ **Learning Outcomes:**
- MVC architecture pattern
- RESTful API design principles
- Database schema design and relationships
- Angular component development
- Frontend-backend integration
- Authentication and authorization patterns

---

## 🚀 Quick Start Commands

**Complete setup from scratch:**
```powershell
# Backend setup
cd backend
npm install
copy .env.example .env
# Edit .env with your MySQL credentials

# Initialize database
node scripts/seedRoles.js
node scripts/createCompetencyTables.js
node scripts/seedCompetencies.js

# Start backend
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm start

# Navigate to http://localhost:4200/competencies
```

---
