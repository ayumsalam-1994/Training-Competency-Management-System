# TCMS Team Startup Guide

## 🚀 Quick Start (All Members)

### Prerequisites
- Node.js installed
- MySQL installed and running
- Git access to the repository

### 1. Initial Setup

```powershell
# Clone and navigate to project
cd "C:\Users\HP\Documents\AGMO Academy\LMS - Angular\Training-Competency-Management-System"

# Setup Backend
cd backend
npm install
copy .env.example .env
# Edit .env file with your MySQL credentials (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
node scripts/seedRoles.js
npm run dev
# Backend now running at http://localhost:4000

# Setup Frontend (new terminal)
cd frontend
npm install
npm start
# Frontend now running at http://localhost:4200
```

### 2. Test the Application

1. **Open browser**: Go to `http://localhost:4200`
2. **Register**: Create a new account on register page
3. **Login**: Sign in with your credentials  
4. **Dashboard**: Use the manual test buttons to verify:
   - Health Check
   - Profile API
   - Login API  
   - Register API

## 📋 Phase 1 Status & Next Steps

### ✅ Completed (Qayyum)
- Express backend with MySQL (no ORM)
- JWT authentication (register, login, profile)
- Angular app with auth service and routing
- Role seeding (Employee, Manager, Admin)
- Manual test dashboard

### 🔄 Ready for Team Members

### Leo - Frontend Components & UI
**Your Phase 1 todos**: `docs/dev/leo/phase-1-todo.md`
- Create course listing components
- Build user management forms
- Add responsive navigation
- Integrate with auth endpoints (already available)

**API endpoints you can use**:
- `GET /auth/profile` (protected)
- `POST /auth/login` 
- `POST /auth/register`

### Hariz - Database Schema & API
**Your Phase 1 todos**: `docs/dev/hariz/phase-1-todo.md`
- Extend MySQL schema (courses, enrollments, competencies)
- Create course CRUD endpoints
- Add data validation middleware  
- Build database migrations

**Current DB structure**:
- `users` table (id, email, password_hash, role_id, created_at)
- `roles` table (id, name, created_at)

### Hanif - DevOps & Infrastructure  
**Your Phase 1 todos**: `docs/dev/hanif/phase-1-todo.md`
- Set up Docker containers
- Create CI/CD pipeline
- Configure environment variables
- Add logging and monitoring

### Suren - Testing & Quality Assurance
**Your Phase 1 todos**: `docs/dev/suren/phase-1-todo.md`  
- Write unit tests for auth service
- Add integration tests for API endpoints
- Create E2E tests with Cypress/Playwright
- Set up test automation

## 🔧 Development Workflow

### Branch Strategy
- Main branch: `main` (protected)
- Feature branches: `feature/member-name-feature-description`
- Example: `feature/leo-course-components`

### Before Starting Work
1. **Pull latest**: `git pull origin main`
2. **Create branch**: `git checkout -b feature/your-name-task-name`
3. **Start both servers**: Backend (`npm run dev`) + Frontend (`npm start`)
4. **Check your phase 1 todo**: See `docs/dev/[your-name]/phase-1-todo.md`

### API Testing
- **Health check**: `GET http://localhost:4000/health`
- **Register**: `POST http://localhost:4000/auth/register` (body: `{"email":"...", "password":"..."}`)
- **Login**: `POST http://localhost:4000/auth/login` (body: `{"email":"...", "password":"..."}`) 
- **Profile**: `GET http://localhost:4000/auth/profile` (header: `Authorization: Bearer <token>`)

### Code Integration
1. **Test locally**: Ensure your features work with existing auth
2. **Commit**: `git add . && git commit -m "feat: describe your changes"`
3. **Push**: `git push origin feature/your-branch-name`
4. **PR**: Create pull request to `main`

## 📂 Project Structure

```
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── routes/auth.js   # Authentication endpoints  
│   │   ├── utils/db.js      # MySQL connection & queries
│   │   └── index.js         # Main server file
│   ├── scripts/seedRoles.js # Database seeding
│   └── package.json
├── frontend/                # Angular application
│   ├── src/app/
│   │   ├── components/      # UI components (login, register, dashboard)
│   │   ├── services/auth.ts # Authentication service
│   │   └── guards/          # Route protection
│   └── package.json  
└── docs/dev/               # Documentation & todos
    ├── [member]/phase-[n]-todo.md
    ├── coordination.md
    └── README-members.md
```

## 🆘 Common Issues

### MySQL Connection Failed
- Verify MySQL is running
- Check credentials in `backend/.env`
- Ensure database `tcms` exists

### Frontend Build Errors  
- Run `npm install` in frontend directory
- Check Angular CLI version: `npx ng version`

### CORS Issues
- Backend already has CORS enabled for `http://localhost:4200`
- If issues persist, check browser console

### Auth Not Working
- Check JWT token in browser localStorage
- Verify backend is running on port 4000
- Test endpoints with dashboard test buttons

## 📞 Getting Help

1. **Check your phase todo**: `docs/dev/[your-name]/phase-1-todo.md`
2. **Review coordination**: `docs/dev/coordination.md`  
3. **Test with dashboard**: Use manual test buttons at `http://localhost:4200`
4. **Ask team**: Post in team chat with error details

**Ready to start? Pick up your Phase 1 tasks and let's build! 🚀**