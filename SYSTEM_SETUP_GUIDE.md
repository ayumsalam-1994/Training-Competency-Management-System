# TCMS - Complete System Setup & Running Guide

**Training & Competency Management System** - Full Stack Application (Angular + Express + MySQL)

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Database Setup](#database-setup)
4. [Backend Setup & Running](#backend-setup--running)
5. [Frontend Setup & Running](#frontend-setup--running)
6. [Running Both Servers](#running-both-servers)
7. [Seeding Sample Data](#seeding-sample-data)
8. [Testing the System](#testing-the-system)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v5.7 or higher) - [Download](https://www.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/)
- **npm** (comes with Node.js)

### Verify Installation
```powershell
node --version          # Should show v14+
npm --version           # Should show 8+
mysql --version         # Should show 5.7+
git --version           # Should show 2.0+
```

---

## Project Structure

```
Training-Competency-Management-System/
├── backend/                    # Express.js API Server
│   ├── src/
│   │   ├── index.js           # Main server file
│   │   ├── routes/            # API routes
│   │   │   ├── auth.js        # Authentication endpoints
│   │   │   ├── quiz.js        # User quiz endpoints
│   │   │   └── admin-quiz.js  # Admin quiz management
│   │   ├── middleware/        # Auth middleware
│   │   └── utils/
│   │       └── db.js          # Database connection & queries
│   ├── scripts/
│   │   ├── seedRoles.js       # Seed roles
│   │   └── seedQuiz.js        # Seed sample quizzes
│   ├── package.json
│   └── .env                   # Environment variables (create this)
│
├── frontend/                  # Angular Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/    # Reusable components
│   │   │   │   ├── quiz/      # Quiz taking components
│   │   │   │   └── admin-quiz/# Admin quiz builder
│   │   │   ├── services/      # API services
│   │   │   ├── app.routes.ts  # Route definitions
│   │   │   └── app.ts         # Root component
│   │   └── main.ts
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
└── docs/dev/                  # Documentation
    └── hariz/                 # Your phase todos
```

---

## Database Setup

### Step 1: Start MySQL Service

**Windows (PowerShell as Admin):**
```powershell
# Start MySQL
net start MySQL80
# Or if using a different version:
net start MySQL57
```

**Mac:**
```bash
mysql.server start
```

**Linux:**
```bash
sudo systemctl start mysql
```

### Step 2: Create Database

Open MySQL command line:
```powershell
mysql -u root -p
# Enter your MySQL root password
```

Then run:
```sql
CREATE DATABASE tcms;
CREATE USER 'tcms_user'@'localhost' IDENTIFIED BY 'tcms_password123';
GRANT ALL PRIVILEGES ON tcms.* TO 'tcms_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Verify Connection

```powershell
mysql -u tcms_user -p tcms
# Enter: tcms_password123
# You should see: mysql>
# Type: EXIT; to quit
```

---

## Backend Setup & Running

### Step 1: Navigate to Backend Directory

```powershell
cd "C:\Users\HP\Documents\AGMO Academy\LMS - Angular\Training-Competency-Management-System\backend"
# Or your project path
```

### Step 2: Install Dependencies

```powershell
npm install
```

This installs: express, cors, dotenv, mysql2, bcrypt, jsonwebtoken, nodemon

### Step 3: Create .env File

Create a file named `.env` in the `backend/` folder:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=tcms_user
DB_PASSWORD=tcms_password123
DB_NAME=tcms

# Server Configuration
PORT=4000

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_this_in_production
TOKEN_EXPIRY=1h
```

**Note**: Change these values in production!

### Step 4: Initialize Database

Run the database seeding script:

```powershell
npm run seed-roles
# Output: Database roles seeded successfully
```

This creates:
- `roles` table with: Employee, Manager, Admin
- `users` table with auth structure
- `quizzes` table structure
- `questions` table structure
- `quiz_options` table structure
- `quiz_attempts` table structure
- `quiz_answers` table structure

### Step 5: Start Backend Server

**Development Mode (with auto-reload):**
```powershell
npm run dev
# Output: Backend running on http://localhost:4000
```

**Production Mode:**
```powershell
npm start
```

**Expected Output:**
```
Database initialized.
Backend running on http://localhost:4000
```

✅ Backend is now running! Keep this terminal open.

---

## Frontend Setup & Running

### Step 1: Open New Terminal

Open a **new PowerShell window** (keep the backend running in the other one)

### Step 2: Navigate to Frontend Directory

```powershell
cd "C:\Users\HP\Documents\AGMO Academy\LMS - Angular\Training-Competency-Management-System\frontend"
```

### Step 3: Install Dependencies

```powershell
npm install
```

This installs Angular, TypeScript, RxJS, and other dependencies (may take 2-3 minutes)

### Step 4: Start Frontend Server

```powershell
npm start
# Or: ng serve
```

**Expected Output:**
```
✔ Compiled successfully
Application bundle generation complete. [5.xxx seconds]

Watch mode enabled. Watching for file changes...
✔ Compiled successfully
...
```

### Step 5: Open in Browser

Once you see "Compiled successfully", open your browser and navigate to:

```
http://localhost:4200
```

You should see the TCMS login page!

---

## Running Both Servers

### Quick Start (Simplified)

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
# Runs on http://localhost:4000
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
# Runs on http://localhost:4200
```

### PowerShell Aliases (Optional - for easier reuse)

Create a PowerShell profile to quickly start both:

```powershell
# Save this in your PowerShell profile
Set-Alias -Name tcms-start-backend -Value { cd backend; npm run dev }
Set-Alias -Name tcms-start-frontend -Value { cd frontend; npm start }
```

---

## Seeding Sample Data

### Seed Sample Quizzes

After backend is running:

```powershell
# In the backend directory
npm run seed-quiz
```

**Output:**
```
Starting quiz seeding...
Created Quiz 1: 1
✓ Quiz 1 seeded with 5 questions
Created Quiz 2: 2
✓ Quiz 2 seeded with 4 questions
Created Quiz 3: 3
✓ Quiz 3 seeded with 3 questions

✅ Quiz seeding completed successfully!

Seeded Quizzes:
- Quiz 1 (ID: 1): JavaScript Fundamentals (5 questions)
- Quiz 2 (ID: 2): React Components & Hooks (4 questions)
- Quiz 3 (ID: 3): HTML & CSS Fundamentals (3 questions)
```

---

## Testing the System

### 1. Register a User

1. Go to `http://localhost:4200`
2. Click "Register"
3. Enter:
   - Email: `user@test.com`
   - Password: `password123`
4. Click "Register"

### 2. Login

1. Enter the credentials from above
2. Click "Login"
3. You'll be redirected to the Dashboard

### 3. Take a Quiz

1. Click "Quizzes" or navigate to `http://localhost:4200/quiz`
2. Click "Take Quiz" on any quiz
3. Answer the questions
4. Click "Submit Quiz"
5. View your results

### 4. Admin Functions (Create Quizzes)

**Register an Admin User:**

```powershell
# In backend directory, open MySQL
mysql -u tcms_user -p tcms
```

Then run:
```sql
-- Find your user ID first
SELECT id, email FROM users WHERE email = 'user@test.com';
-- Update them to Admin (role_id = 3)
UPDATE users SET role_id = 3 WHERE id = 1;
EXIT;
```

Then:
1. Logout and login again
2. Go to `http://localhost:4200/admin/quiz/create` (new quiz)
3. Or `http://localhost:4200/admin/quiz/1` (edit quiz)
4. Create/edit questions, set options, save

---

## API Endpoints Reference

### Public Endpoints (No Auth Required)

```
GET  /quiz                           # List all quizzes
GET  /quiz/:quizId                   # Get quiz details
GET  /quiz/:quizId/questions         # Get questions
```

### User Endpoints (Auth Required)

```
POST /auth/register                  # Register user
POST /auth/login                     # Login user
GET  /auth/profile                   # Get user profile

POST /quiz/:quizId/attempt/start     # Start quiz
POST /quiz/:quizId/attempt/:attemptId/answer  # Submit answer
POST /quiz/:quizId/attempt/:attemptId/submit  # Complete quiz
GET  /quiz/:quizId/attempt/:attemptId/results # View results
GET  /quiz/:quizId/my-attempts       # Get user's attempts
```

### Admin Endpoints (Auth + Admin Role Required)

```
POST /admin/quiz                     # Create quiz
PUT  /admin/quiz/:quizId             # Update quiz
DELETE /admin/quiz/:quizId           # Delete quiz

POST /admin/quiz/:quizId/questions             # Create question
PUT  /admin/quiz/:quizId/questions/:questionId # Update question
DELETE /admin/quiz/:quizId/questions/:questionId # Delete question

POST /admin/quiz/:quizId/questions/:questionId/options # Create option
PUT  /admin/quiz/:quizId/questions/:questionId/options/:optionId # Update
DELETE /admin/quiz/:quizId/questions/:questionId/options/:optionId # Delete
```

---

## Testing API with Postman

### Import Collection

1. Download Postman: https://www.postman.com/downloads/
2. Create a new request

### Test Register
```
POST http://localhost:4000/auth/register
Body (JSON):
{
  "email": "test@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "roleId": 1
  }
}
```

### Test Get All Quizzes
```
GET http://localhost:4000/quiz
```

### Test Start Quiz (with Token)
```
POST http://localhost:4000/quiz/1/attempt/start
Headers:
  Authorization: Bearer <your_token_from_register>
```

---

## Troubleshooting

### Issue: "Cannot find module 'express'"

**Solution:**
```powershell
cd backend
npm install
```

### Issue: "MySQL Connection Failed"

**Check:**
1. Is MySQL running? `net start MySQL80`
2. Correct credentials in `.env`?
3. Database exists? `mysql -u tcms_user -p tcms`

### Issue: "Port 4000 already in use"

**Solution:**
```powershell
# Find process using port 4000
Get-NetTCPConnection -LocalPort 4000

# Kill the process (replace PID with actual)
Stop-Process -Id <PID> -Force

# Or use different port in .env
# PORT=4001
```

### Issue: "Angular compilation error"

**Solution:**
```powershell
cd frontend
rm -Recurse node_modules
npm install
npm start
```

### Issue: "Cannot find quiz routes"

**Check:**
1. Backend is running: `http://localhost:4000/health` should return `{"status":"ok"}`
2. Frontend .env or settings point to correct backend
3. CORS enabled in backend (it is by default)

---

## Development Workflow

### When Making Changes

**Backend Changes:**
```powershell
# Nodemon auto-restarts on save
# Just edit and save files in src/
```

**Frontend Changes:**
```powershell
# Angular auto-recompiles on save
# Changes appear in browser immediately
```

### Debugging

**Backend - Add Logs:**
```javascript
console.log('Debug:', variableName);
```

**Frontend - Use Browser DevTools:**
```
F12 → Network tab (see API calls)
F12 → Console tab (see errors)
F12 → Application tab (see localStorage tokens)
```

---

## Next Steps

1. ✅ **Phase 1**: Quiz & Assessment Module (Completed)
2. 🔄 **Phase 2**: Admin Quiz Management (In Progress)
3. ⏳ **Phase 3**: Advanced Features (Course Integration)
4. ⏳ **Phase 4**: Competency Tracking
5. ⏳ **Phase 5**: Analytics Dashboard

---

## Quick Reference Commands

| Task | Command |
|------|---------|
| Start backend | `cd backend && npm run dev` |
| Start frontend | `cd frontend && npm start` |
| Seed roles | `cd backend && npm run seed-roles` |
| Seed quizzes | `cd backend && npm run seed-quiz` |
| Access MySQL | `mysql -u tcms_user -p tcms` |
| View backend logs | Check terminal running `npm run dev` |
| View frontend errors | F12 in browser (Console tab) |

---

## Support & Resources

- **Angular Docs**: https://angular.io/docs
- **Express Docs**: https://expressjs.com/
- **MySQL Docs**: https://dev.mysql.com/doc/
- **JWT**: https://jwt.io/
- **CORS**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

**Happy Coding! 🚀**

Created: December 5, 2025
Last Updated: December 5, 2025
