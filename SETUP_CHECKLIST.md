# ✅ TCMS Setup Checklist

## Phase 1: Database Setup

- [ ] Open MySQL 8.0 Workbench
- [ ] Connect to Local instance MySQL80
- [ ] Run this SQL in Workbench:
  ```sql
  CREATE DATABASE IF NOT EXISTS tcms;
  CREATE USER IF NOT EXISTS 'tcms_user'@'localhost' IDENTIFIED BY 'tcms_password123';
  GRANT ALL PRIVILEGES ON tcms.* TO 'tcms_user'@'localhost';
  FLUSH PRIVILEGES;
  ```
- [ ] Click Lightning Bolt ⚡ to execute
- [ ] Verify with: `SELECT * FROM mysql.user WHERE User = 'tcms_user';`

**Status:** ✅ Database Ready

---

## Phase 2: Backend Setup

- [ ] Open PowerShell in project folder
- [ ] Navigate: `cd backend`
- [ ] Run: `npm install`
- [ ] Create `.env` file in backend folder with:
  ```env
  DB_HOST=localhost
  DB_USER=tcms_user
  DB_PASSWORD=tcms_password123
  DB_NAME=tcms
  PORT=4000
  JWT_SECRET=my_secret_key
  TOKEN_EXPIRY=1h
  ```
- [ ] Save `.env` file
- [ ] Run: `npm run seed-roles`
- [ ] Run: `npm run seed-quiz`
- [ ] Verify message: "✅ Quiz seeding completed successfully!"

**Status:** ✅ Backend Ready

---

## Phase 3: Frontend Setup

- [ ] Open NEW PowerShell window (keep backend one open)
- [ ] Navigate: `cd frontend`
- [ ] Run: `npm install`
- [ ] Wait for completion

**Status:** ✅ Frontend Ready

---

## Phase 4: Run Both Servers

### Terminal 1 (Backend):
- [ ] `cd backend`
- [ ] `npm run dev`
- [ ] Wait for: "Backend running on http://localhost:4000"
- [ ] ✅ Leave this terminal running

### Terminal 2 (Frontend):
- [ ] `cd frontend`
- [ ] `npm start`
- [ ] Wait for: "Compiled successfully"
- [ ] Browser opens to: http://localhost:4200
- [ ] ✅ Leave this terminal running

**Status:** ✅ System Running

---

## Phase 5: Verify System

In Browser (http://localhost:4200):
- [ ] See login page
- [ ] Click "Register"
- [ ] Create account: email: test@example.com, password: test123
- [ ] Click "Register"
- [ ] See Dashboard
- [ ] Click "Quizzes" 
- [ ] See 3 quizzes listed
- [ ] Click "Take Quiz"
- [ ] Answer questions
- [ ] Click "Submit Quiz"
- [ ] See results page

In Workbench:
- [ ] Run: `SELECT * FROM quizzes;` → See 3 quizzes
- [ ] Run: `SELECT * FROM users;` → See your user
- [ ] Run: `SELECT * FROM quiz_attempts;` → See your attempt

In Browser Tab 2:
- [ ] Open: `http://localhost:4000/health`
- [ ] See: `{"status":"ok"}`

**Status:** ✅ All Working!

---

## Phase 6: Admin Setup (Optional)

In MySQL Workbench:
- [ ] Run: `SELECT id, email FROM users;`
- [ ] Find your user ID (e.g., 1)
- [ ] Run: `UPDATE users SET role_id = 3 WHERE id = 1;`

In Browser:
- [ ] Logout
- [ ] Login again
- [ ] Go to: `http://localhost:4200/admin/quiz/create`
- [ ] Fill in quiz details
- [ ] Add questions
- [ ] Click Save

**Status:** ✅ Admin Features Ready

---

## 🎯 Success Indicators

✅ **System is working if you see:**
1. Login page at http://localhost:4200
2. Dashboard after registration
3. 3 quizzes in the quizzes page
4. Can take a quiz and submit
5. Can view results
6. Backend responds to http://localhost:4000/health
7. Can see data in MySQL Workbench

---

## 🆘 If Something Fails

| Issue | Check |
|-------|-------|
| MySQL connection fails | Is Workbench connected? |
| npm install fails | Is Node.js installed? |
| Backend won't start | Did you create .env file? |
| Frontend won't compile | Run: `cd frontend && rm -Recurse node_modules && npm install` |
| No quizzes showing | Did you run: `npm run seed-quiz`? |
| Tables don't exist | Did you run: `npm run seed-roles`? |
| Port already in use | Kill process or change PORT in .env |

---

## 📞 Quick Help

**Backend Terminal:**
- `npm run dev` - Start in development mode
- `npm run seed-roles` - Initialize database
- `npm run seed-quiz` - Add sample quizzes
- `Ctrl+C` - Stop server

**Frontend Terminal:**
- `npm start` - Start development server
- `npm install` - Install dependencies
- `Ctrl+C` - Stop server

**MySQL Workbench:**
- `Ctrl+Enter` or ⚡ - Execute query
- `Ctrl+A` - Select all
- `Ctrl+T` - New query tab

---

## 📝 Notes

```
What I did:
- Database: tcms
- User: tcms_user
- Password: tcms_password123
- Backend Port: 4000
- Frontend Port: 4200

Admin Credentials (after making user admin):
- Email: test@example.com
- Password: test123
```

---

## ✨ Ready to Start?

**See SETUP_VISUAL_GUIDE.md for step-by-step instructions!**

Or just follow this checklist from top to bottom. ✅

---

**Last Updated:** December 5, 2025
**Status:** ✅ Complete
