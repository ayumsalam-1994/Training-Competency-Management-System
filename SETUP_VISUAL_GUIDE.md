# 🎯 TCMS Setup - Step by Step (Visual)

## ✅ Prerequisites Checklist

Before starting, make sure you have:

- [ ] **MySQL 8.0 Workbench** installed (download from mysql.com)
- [ ] **Node.js v14+** installed (check: `node --version`)
- [ ] **npm 8+** installed (check: `npm --version`)
- [ ] **Git** installed (check: `git --version`)
- [ ] **Project folder** on your computer
- [ ] **PowerShell** (Windows) or **Terminal** (Mac/Linux)

---

## 🚀 Step-by-Step Setup

### **STEP 1: Database Setup (5 minutes)**

#### 1a. Open MySQL Workbench
```
Start Menu → Search "MySQL 8.0 Workbench" → Click to open
```

#### 1b. Connect to Database
```
Double-click on "Local instance MySQL80"
(You may be asked for password - use your MySQL root password)
```

#### 1c. Create Database and User
Copy this entire code block:
```sql
CREATE DATABASE IF NOT EXISTS tcms;
CREATE USER IF NOT EXISTS 'tcms_user'@'localhost' IDENTIFIED BY 'tcms_password123';
GRANT ALL PRIVILEGES ON tcms.* TO 'tcms_user'@'localhost';
FLUSH PRIVILEGES;
```

Paste it into Workbench and:
1. Select all (Ctrl+A)
2. Click **Lightning Bolt ⚡** to execute
3. You should see "Query OK" messages

✅ **Database is ready!**

---

### **STEP 2: Backend Setup (5 minutes)**

#### 2a. Open PowerShell
```
Right-click on folder → "Open in Terminal" → Select PowerShell
Or: Win+R → type "powershell" → Enter
```

#### 2b. Navigate to Project
```powershell
cd "C:\Users\HP\Documents\AGMO Academy\LMS - Angular\Training-Competency-Management-System\backend"
```

#### 2c. Install Dependencies
```powershell
npm install
```
**Wait for completion** (you'll see "added X packages")

#### 2d. Create .env File
1. In `backend` folder, create new file named `.env`
2. Paste this:
```env
DB_HOST=localhost
DB_USER=tcms_user
DB_PASSWORD=tcms_password123
DB_NAME=tcms
PORT=4000
JWT_SECRET=my_secret_key_change_this_in_production
TOKEN_EXPIRY=1h
```
3. Save file

#### 2e. Initialize Database
```powershell
npm run seed-roles
```
**You should see:**
```
Database initialized.
Database tables initialized successfully.
```

#### 2f. Add Sample Quizzes
```powershell
npm run seed-quiz
```
**You should see:**
```
✅ Quiz seeding completed successfully!
- Quiz 1: JavaScript Fundamentals (5 questions)
- Quiz 2: React Components & Hooks (4 questions)
- Quiz 3: HTML & CSS Fundamentals (3 questions)
```

✅ **Backend is ready!**

---

### **STEP 3: Frontend Setup (5 minutes)**

#### 3a. Open NEW PowerShell Window
```
Keep your backend PowerShell open!
Open a NEW PowerShell window
```

#### 3b. Navigate to Frontend
```powershell
cd "C:\Users\HP\Documents\AGMO Academy\LMS - Angular\Training-Competency-Management-System\frontend"
```

#### 3c. Install Dependencies
```powershell
npm install
```
**Wait for completion**

✅ **Frontend is ready!**

---

## 🎮 Running the System (Daily)

### **Terminal 1: Start Backend**

```powershell
cd backend
npm run dev
```

**Wait for this message:**
```
✅ Backend running on http://localhost:4000
```

### **Terminal 2: Start Frontend**

In a new PowerShell window:
```powershell
cd frontend
npm start
```

**Wait for this message:**
```
✅ Compiled successfully
✔ Compiled successfully
```

**Your browser should automatically open:**
```
http://localhost:4200
```

---

## ✅ Verify Everything Works

### In Browser (http://localhost:4200):

1. **See login page?** ✅
2. **Click "Register"** → Create account (email: test@example.com, password: test123)
3. **See Dashboard?** ✅
4. **Click "Quizzes"** in navigation
5. **See 3 quizzes listed?** (JavaScript, React, HTML/CSS) ✅
6. **Click "Take Quiz"** on any quiz
7. **Answer questions** → Click "Submit Quiz"
8. **See results?** ✅

**If you see all of this, you're good!** 🎉

---

## 🔧 Verify Backend Works

### In Another Browser Tab:

Open: `http://localhost:4000/health`

**Should show:**
```json
{"status":"ok"}
```

✅ **Backend is communicating!**

---

## 👨‍💼 Admin Setup (Optional - to Create Quizzes)

### In MySQL Workbench:

```sql
-- Find your user ID
SELECT id, email FROM users;

-- Note the ID of your user (e.g., 1)
-- Update to Admin (role_id = 3)
UPDATE users SET role_id = 3 WHERE id = 1;
```

### Back in Browser:

1. **Logout** (click your email → Logout)
2. **Login again** with same credentials
3. **Go to:** `http://localhost:4200/admin/quiz/create`
4. **Create new quiz** by filling in details
5. **Add questions** and click Save

---

## 📊 Database Verification

### In MySQL Workbench:

Run these to verify all data:
```sql
-- Check quizzes
SELECT * FROM quizzes;

-- Check questions
SELECT * FROM questions;

-- Check users
SELECT * FROM users;
```

You should see sample data!

---

## 🆘 Quick Troubleshooting

### Issue: "Cannot connect to MySQL"
**Fix:** Check MySQL Workbench can connect (it shows in Home screen)

### Issue: "npm: command not found"
**Fix:** Restart PowerShell or reinstall Node.js

### Issue: "Backend won't start"
**Fix:** 
```powershell
cd backend
npm run seed-roles  # Try this first
npm run dev
```

### Issue: "Angular compilation error"
**Fix:**
```powershell
cd frontend
rm -Recurse node_modules
npm install
npm start
```

### Issue: "Tables don't exist"
**Fix:** In Workbench, run:
```sql
USE tcms;
SHOW TABLES;
-- If empty, run in PowerShell: npm run seed-roles
```

---

## 📚 Important Files

| File | Purpose | Location |
|------|---------|----------|
| `.env` | Database config | `backend/.env` |
| `package.json` | Dependencies | `backend/` & `frontend/` |
| Quiz endpoints | API | `backend/src/routes/quiz.js` |
| Admin endpoints | API | `backend/src/routes/admin-quiz.js` |
| Quiz component | User UI | `frontend/src/app/components/quiz/` |
| Admin builder | Admin UI | `frontend/src/app/components/admin-quiz/` |

---

## 🎯 What You Can Do Now

✅ **Users can:**
- Register and login
- Browse quizzes
- Take quizzes
- View results
- Retry quizzes

✅ **Admins can:**
- Create new quizzes
- Edit existing quizzes
- Delete quizzes
- Add questions (MCQ, True/False, Short Answer)
- Manage quiz options

✅ **Backend provides:**
- User authentication (JWT)
- Quiz management
- Quiz attempt tracking
- Score calculation
- Role-based access control

---

## 📖 Documentation Files

If you need more details, read:
1. **MYSQL_WORKBENCH_SETUP.md** - Detailed Workbench guide
2. **QUICK_START.md** - Quick reference
3. **SYSTEM_SETUP_GUIDE.md** - Complete documentation

---

## 🚀 You're Done!

**Your TCMS system is now fully functional!**

Go ahead and:
1. Register a user
2. Take a quiz
3. View results
4. Create a new quiz as admin

**Questions?** Check the documentation files above! 📚

---

**Created:** December 5, 2025  
**Status:** ✅ Complete & Ready to Use
