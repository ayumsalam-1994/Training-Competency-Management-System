# MySQL 8.0 Workbench Setup Guide for TCMS

This guide shows you how to set up the TCMS database using **MySQL 8.0 Workbench** (GUI method).

---

## Step 1: Open MySQL Workbench

1. Open **MySQL 8.0 Workbench**
2. Click on your **Local instance MySQL80** connection (or create one if you don't have it)
3. Enter your root password
4. Click "OK"

You should now see the Workbench interface with a blank query editor.

---

## Step 2: Create Database and User

In the **Query Tab**, paste and run **all of this code** at once:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS tcms;

-- Create user
CREATE USER IF NOT EXISTS 'tcms_user'@'localhost' IDENTIFIED BY 'tcms_password123';

-- Grant all privileges
GRANT ALL PRIVILEGES ON tcms.* TO 'tcms_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify (should show 1 row)
SELECT User, Host FROM mysql.user WHERE User = 'tcms_user';
```

**How to run:**
1. Select all the code (Ctrl+A)
2. Click the **Lightning bolt icon** ⚡ or press **Ctrl+Enter**
3. You should see "Query OK" messages in the output

---

## Step 3: Verify Connection

In a new query tab, run:

```sql
-- Switch to tcms database
USE tcms;

-- Show current database
SELECT DATABASE();

-- Should return: tcms
```

If you see "tcms" returned, your database is ready! ✅

---

## Step 4: Update Backend .env File

Update your `backend/.env` file with these credentials:

```env
DB_HOST=localhost
DB_USER=tcms_user
DB_PASSWORD=tcms_password123
DB_NAME=tcms
PORT=4000
JWT_SECRET=your_super_secret_key_here
TOKEN_EXPIRY=1h
```

---

## Step 5: Initialize Database Tables

Go back to PowerShell and run:

```powershell
cd backend
npm run seed-roles
```

This will:
- Create all tables automatically (roles, users, quizzes, questions, etc.)
- Seed the default roles (Employee, Manager, Admin)

**Expected output:**
```
Database initialized.
Database tables initialized successfully.
```

---

## Step 6: Verify Tables in Workbench

In Workbench, run:

```sql
-- See all tables
SHOW TABLES;

-- See table structure
DESCRIBE users;
DESCRIBE roles;
DESCRIBE quizzes;
DESCRIBE questions;
DESCRIBE quiz_options;
DESCRIBE quiz_attempts;
DESCRIBE quiz_answers;
```

You should see all these tables! ✅

---

## Step 7: Seed Sample Data

Back in PowerShell:

```powershell
cd backend
npm run seed-quiz
```

This adds 3 sample quizzes with questions.

**Verify in Workbench:**

```sql
-- Check quizzes
SELECT * FROM quizzes;

-- Check questions
SELECT * FROM questions;

-- Check options
SELECT * FROM quiz_options;
```

You should see sample data! ✅

---

## Step 8: Start the System

Now you're ready to run everything:

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```

Visit: http://localhost:4200

---

## Common Workbench Tasks

### View All Data in a Table
```sql
SELECT * FROM quizzes;
SELECT * FROM users;
SELECT * FROM quiz_attempts;
```

### Make a User Admin
```sql
-- First, find your user ID
SELECT id, email, role_id FROM users;

-- Update role_id to 3 (Admin)
UPDATE users SET role_id = 3 WHERE email = 'your_email@example.com';

-- Verify
SELECT * FROM users WHERE email = 'your_email@example.com';
```

### Clear All Data (Reset)
```sql
-- Delete all data (keeps tables)
DELETE FROM quiz_answers;
DELETE FROM quiz_attempts;
DELETE FROM quiz_options;
DELETE FROM questions;
DELETE FROM quizzes;
DELETE FROM users;

-- Reset auto-increment counters
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE quizzes AUTO_INCREMENT = 1;
ALTER TABLE questions AUTO_INCREMENT = 1;
```

### Export Data (Backup)
1. Right-click on **quizzes** table → **Table Data Export Wizard**
2. Choose CSV or JSON format
3. Select location to save
4. Click "Next" and "Finish"

### View Database Diagram
1. Click **Database** menu
2. Select **Reverse Engineer**
3. Choose **tcms** database
4. Click through wizard
5. You'll see an ER diagram of all tables

---

## Troubleshooting

### Error: "Access Denied for user 'tcms_user'@'localhost'"

**Solution:** The user doesn't exist. Run the CREATE USER command again:

```sql
CREATE USER 'tcms_user'@'localhost' IDENTIFIED BY 'tcms_password123';
GRANT ALL PRIVILEGES ON tcms.* TO 'tcms_user'@'localhost';
FLUSH PRIVILEGES;
```

### Error: "Unknown database 'tcms'"

**Solution:** The database doesn't exist. Run:

```sql
CREATE DATABASE tcms;
USE tcms;
```

### Error: "Table 'tcms.users' doesn't exist"

**Solution:** Tables weren't created. In backend directory, run:

```powershell
npm run seed-roles
```

### Tables are Empty

**Solution:** Add sample data:

```powershell
cd backend
npm run seed-quiz
```

---

## Quick Reference - Key SQL Queries

```sql
-- Check everything exists
USE tcms;
SHOW TABLES;

-- View users
SELECT id, email, role_id FROM users;

-- View quizzes
SELECT id, title, difficulty, passing_score FROM quizzes;

-- View questions for a quiz
SELECT * FROM questions WHERE quiz_id = 1;

-- View quiz attempts
SELECT id, user_id, quiz_id, score, percentage FROM quiz_attempts;

-- View quiz answers
SELECT * FROM quiz_answers WHERE attempt_id = 1;

-- Change user to admin
UPDATE users SET role_id = 3 WHERE id = 1;
```

---

## Workbench Tips & Tricks

| Action | How |
|--------|-----|
| Run query | **Ctrl+Enter** or click ⚡ |
| Clear results | **Ctrl+Shift+Del** |
| Comment code | **Ctrl+/** |
| Format code | **Ctrl+B** |
| Save query | **Ctrl+S** |
| New query tab | **Ctrl+T** |
| Execute all | Click ⚡⚡ (double lightning) |

---

## Next Steps

1. ✅ Database created
2. ✅ Tables initialized
3. ✅ Sample data seeded
4. ▶️ **Start backend:** `cd backend && npm run dev`
5. ▶️ **Start frontend:** `cd frontend && npm start`
6. ▶️ **Open browser:** http://localhost:4200

---

**You're all set! Start from Step 8 to run the system.** 🚀
