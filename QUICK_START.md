# 🚀 QUICK START - TCMS System

## One-Time Setup (First Time Only)

### 1. MySQL Database (Using Workbench - Recommended)

**See MYSQL_WORKBENCH_SETUP.md for detailed Workbench guide!**

Quick version:
1. Open **MySQL 8.0 Workbench**
2. Connect to your Local MySQL80 instance
3. Run this in the query editor:

```sql
CREATE DATABASE IF NOT EXISTS tcms;
CREATE USER IF NOT EXISTS 'tcms_user'@'localhost' IDENTIFIED BY 'tcms_password123';
GRANT ALL PRIVILEGES ON tcms.* TO 'tcms_user'@'localhost';
FLUSH PRIVILEGES;
```

4. Click ⚡ (Lightning bolt) to execute

### 2. Backend Setup
```powershell
cd backend
npm install

# Create .env file with:
# DB_HOST=localhost
# DB_USER=tcms_user
# DB_PASSWORD=tcms_password123
# DB_NAME=tcms
# PORT=4000
# JWT_SECRET=your_secret_key_here
# TOKEN_EXPIRY=1h

npm run seed-roles  # Initialize database
npm run seed-quiz   # Add sample quizzes
```

### 3. Frontend Setup
```powershell
cd frontend
npm install
```

---

## Daily Running (Quick Start)

### Terminal 1 - Start Backend
```powershell
cd backend
npm run dev
# Wait for: "Backend running on http://localhost:4000"
```

### Terminal 2 - Start Frontend
```powershell
cd frontend
npm start
# Wait for: "Compiled successfully"
# Browser opens to http://localhost:4200
```

---

## Testing Immediately

1. **Open** http://localhost:4200
2. **Register**: Create account
3. **View Quizzes**: Click "Quizzes"
4. **Take Quiz**: Click any quiz
5. **Submit**: Answer & view results

---

## Admin Access (Create Quizzes)

### Make Your User Admin (in Workbench)
```sql
-- Find your user
SELECT id, email FROM users WHERE email = 'your_email@example.com';

-- Update to Admin (role_id = 3)
UPDATE users SET role_id = 3 WHERE id = 1;  -- Replace 1 with your ID
```

### Create New Quiz
1. Logout & Login again
2. Go to `http://localhost:4200/admin/quiz/create`
3. Fill in quiz details
4. Save quiz
5. Add questions (MCQ, True/False, or Short Answer)
6. Click Save

---

## API Testing (Postman)

### Register
```
POST http://localhost:4000/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### Get All Quizzes
```
GET http://localhost:4000/quiz
```

### Start Quiz
```
POST http://localhost:4000/quiz/1/attempt/start
Authorization: Bearer <token_from_register>
```

---

## Common Fixes

| Problem | Solution |
|---------|----------|
| MySQL connection fails | Use Workbench to verify: `SELECT * FROM users;` |
| Port 4000 in use | Change PORT in backend/.env |
| npm not found | Install Node.js from nodejs.org |
| Angular errors | `cd frontend && rm -Recurse node_modules && npm install` |
| Quiz not showing | Make sure you ran `npm run seed-quiz` |
| Database not created | Run SQL in Workbench, then `npm run seed-roles` |

---

## Database Management

### View Data in Workbench
```sql
-- See all quizzes
SELECT * FROM quizzes;

-- See all users
SELECT * FROM users;

-- See quiz attempts
SELECT * FROM quiz_attempts;
```

### Clear Database (Reset)
```sql
DELETE FROM quiz_answers;
DELETE FROM quiz_attempts;
DELETE FROM quiz_options;
DELETE FROM questions;
DELETE FROM quizzes;
DELETE FROM users;
-- Tables stay, data is cleared
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `backend/.env` | Database & server config |
| `backend/src/routes/quiz.js` | User quiz endpoints |
| `backend/src/routes/admin-quiz.js` | Admin quiz management |
| `frontend/src/app/components/quiz/` | Quiz taking components |
| `frontend/src/app/components/admin-quiz/` | Admin quiz builder |

---

## Project Status

✅ **Phase 1** - Quiz Module (Complete)
✅ **Phase 2** - Admin Quiz Management (Complete)  
⏳ **Phase 3-5** - Future enhancements

---

## Documentation Files

- **MYSQL_WORKBENCH_SETUP.md** ← Use this for detailed Workbench setup
- **SYSTEM_SETUP_GUIDE.md** - Complete system documentation
- **QUICK_START.md** - This file (quick reference)

---

**See MYSQL_WORKBENCH_SETUP.md for step-by-step Workbench guide!** 🚀
