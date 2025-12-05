# 📚 TCMS Documentation Index

Welcome! This is your guide to all documentation files for the **Training & Competency Management System (TCMS)**.

---

## 🚀 **START HERE**

### For First Time Setup:
1. **Read:** `SETUP_CHECKLIST.md` (2 minutes) - Quick checklist
2. **Follow:** `SETUP_VISUAL_GUIDE.md` (10 minutes) - Step-by-step visual guide
3. **Reference:** `MYSQL_WORKBENCH_SETUP.md` - Detailed Workbench guide

### For Daily Use:
- **Use:** `QUICK_START.md` - Quick reference for running system

### For Complete Details:
- **Read:** `SYSTEM_SETUP_GUIDE.md` - Complete documentation with all details

---

## 📁 Documentation Files

### **Core Setup Guides**

| File | Purpose | Time | Best For |
|------|---------|------|----------|
| `SETUP_CHECKLIST.md` | Printable checklist | 5 min | Quick reference |
| `SETUP_VISUAL_GUIDE.md` | Step-by-step visual guide | 15 min | First time setup |
| `MYSQL_WORKBENCH_SETUP.md` | Detailed Workbench guide | 10 min | Database setup |
| `SYSTEM_SETUP_GUIDE.md` | Complete documentation | 30 min | All details |
| `QUICK_START.md` | Daily quick reference | 2 min | Running system |

### **Module Documentation**

| File | Purpose | For |
|------|---------|-----|
| `QUIZ_IMPLEMENTATION_GUIDE.md` | Quiz module testing | Phase 1 (Users) |
| `docs/dev/hariz/phase-1-todo.md` | Phase 1 completion | Quiz Module |
| `docs/dev/hariz/phase-2-todo.md` | Phase 2 completion | Admin Management |

---

## 🎯 Quick Navigation

### "How do I...?"

**...set up the database?**
→ `MYSQL_WORKBENCH_SETUP.md` (Quick version in `SETUP_CHECKLIST.md`)

**...run the system?**
→ `SETUP_VISUAL_GUIDE.md` (Step 3 onwards) or `QUICK_START.md`

**...create a quiz as admin?**
→ `SETUP_VISUAL_GUIDE.md` (Scroll to "Admin Setup") 

**...verify everything works?**
→ `SETUP_VISUAL_GUIDE.md` (Scroll to "Verify Everything Works")

**...fix an error?**
→ `SETUP_CHECKLIST.md` (Section "If Something Fails") or `SYSTEM_SETUP_GUIDE.md` (Troubleshooting)

**...test the API?**
→ `SYSTEM_SETUP_GUIDE.md` (Section "Testing API with Postman")

**...understand the project structure?**
→ `SYSTEM_SETUP_GUIDE.md` (Section "Project Structure") or `QUICK_START.md`

**...find an API endpoint?**
→ `SYSTEM_SETUP_GUIDE.md` (Section "API Endpoints Reference")

---

## 📊 Current Project Status

### ✅ Completed

- **Phase 1:** Quiz & Assessment Module
  - User quiz taking
  - Quiz listing
  - Results tracking
  - Multiple question types (MCQ, True/False, Short Answer)

- **Phase 2:** Admin Quiz Management
  - Admin quiz creation/editing/deletion
  - Question management (CRUD)
  - Option management
  - Admin UI dashboard
  - Role-based access control

### 🔄 In Progress
- Phase 3: Course Integration
- Phase 4: Competency Tracking
- Phase 5: Analytics Dashboard

---

## 🛠️ Tech Stack

- **Frontend:** Angular 20.3 (TypeScript, RxJS)
- **Backend:** Express.js (Node.js)
- **Database:** MySQL 8.0
- **Authentication:** JWT (JSON Web Tokens)
- **Authorization:** Role-based access control (RBAC)

---

## 🔑 Key Files in Project

### Backend Structure
```
backend/
├── src/
│   ├── index.js              # Main server
│   ├── routes/
│   │   ├── auth.js           # Auth endpoints
│   │   ├── quiz.js           # User quiz endpoints
│   │   └── admin-quiz.js     # Admin endpoints
│   ├── middleware/
│   │   └── authMiddleware.js # Auth & admin checks
│   └── utils/
│       └── db.js             # Database functions
├── scripts/
│   ├── seedRoles.js          # Initialize database
│   └── seedQuiz.js           # Add sample data
├── package.json
└── .env                      # Configuration
```

### Frontend Structure
```
frontend/
├── src/
│   └── app/
│       ├── components/
│       │   ├── quiz/         # User quiz components
│       │   ├── admin-quiz/   # Admin components
│       │   ├── login/
│       │   ├── register/
│       │   └── dashboard/
│       ├── services/
│       │   └── quiz.service.ts  # API calls
│       ├── app.routes.ts     # Routing
│       └── app.ts            # Root component
├── package.json
└── angular.json
```

---

## 🚦 Setup Time Estimates

| Task | Time | Difficulty |
|------|------|------------|
| Install prerequisites | 30 min | Easy |
| Database setup | 10 min | Easy |
| Backend setup | 10 min | Easy |
| Frontend setup | 10 min | Easy |
| **Total First Time** | **60 min** | **Easy** |
| Daily startup | 2 min | Easy |

---

## 📝 Important Configuration

### Database Credentials (in `.env`)
```env
DB_HOST=localhost
DB_USER=tcms_user
DB_PASSWORD=tcms_password123
DB_NAME=tcms
```

### Server Configuration
```env
PORT=4000              # Backend
JWT_SECRET=your_key    # Change in production!
TOKEN_EXPIRY=1h
```

### Frontend Points To
```
http://localhost:4000  # Backend API
http://localhost:4200  # Frontend (auto-opens)
```

---

## 🎓 Learning Path

### For Users (Taking Quizzes)
1. Register at login page
2. Browse quizzes
3. Take quiz
4. View results
5. Retry if needed

### For Admins (Creating Quizzes)
1. **Prerequisite:** Make user admin (in Workbench)
2. Go to `/admin/quiz/create`
3. Create quiz (title, description, duration, passing score)
4. Add questions (MCQ/True-False/Short Answer)
5. Add options for MCQ questions
6. Save quiz

### For Developers
1. Understand project structure (see above)
2. Review API endpoints (`SYSTEM_SETUP_GUIDE.md`)
3. Check component files in frontend/src/app/components/
4. Review database schema (backend/src/utils/db.js)

---

## 🤔 FAQ

**Q: Do I need to install MySQL separately?**
A: If you have MySQL 8.0 Workbench, MySQL is already installed!

**Q: Can I use a different port?**
A: Yes, change `PORT=4000` in `backend/.env` and update frontend API URL

**Q: How do I reset the database?**
A: In Workbench, run the SQL from "Clear Database" section

**Q: How do I backup the database?**
A: Use Workbench's "Table Data Export Wizard" or `mysqldump` command

**Q: Can multiple users take quizzes simultaneously?**
A: Yes! The system supports concurrent users

**Q: Is the system production-ready?**
A: It's development-ready. For production, you'll need: HTTPS, environment-specific configs, input validation, error handling improvements, and security hardening

---

## 🆘 Support Resources

| Topic | Resource |
|-------|----------|
| Angular | https://angular.io/docs |
| Express.js | https://expressjs.com/ |
| MySQL | https://dev.mysql.com/doc/ |
| JWT | https://jwt.io/ |
| Node.js | https://nodejs.org/docs/ |

---

## 📞 Quick Help

### Getting Started
- **First time?** → Read `SETUP_VISUAL_GUIDE.md`
- **Quick reference?** → Use `SETUP_CHECKLIST.md`

### Running System
- **Start backend:** `cd backend && npm run dev`
- **Start frontend:** `cd frontend && npm start`

### Database Issues
- **Connection failed?** → See `MYSQL_WORKBENCH_SETUP.md` (Troubleshooting)
- **Tables missing?** → Run `npm run seed-roles` in backend

### System Issues
- **Port in use?** → Change PORT in `.env`
- **Module not found?** → Run `npm install` in appropriate folder
- **Compilation error?** → Delete node_modules and reinstall

---

## ✅ Verification Checklist

Before claiming "setup complete," verify:

- [ ] MySQL Workbench connects successfully
- [ ] `tcms` database exists
- [ ] Backend starts with `npm run dev`
- [ ] Frontend compiles with `npm start`
- [ ] Can access http://localhost:4200
- [ ] Can access http://localhost:4000/health
- [ ] Can register a user
- [ ] Can see quizzes on the page
- [ ] Can take a quiz
- [ ] Can view results
- [ ] Can see data in MySQL Workbench

If all checkmarks are done, **you're all set!** ✅

---

## 📈 Project Progress

```
Phase 1: Quiz Module         ████████████████████ 100% ✅
Phase 2: Admin Management    ████████████████████ 100% ✅
Phase 3: Course Integration  ░░░░░░░░░░░░░░░░░░░░   0%
Phase 4: Competency Tracking ░░░░░░░░░░░░░░░░░░░░   0%
Phase 5: Analytics Dashboard ░░░░░░░░░░░░░░░░░░░░   0%

Overall: ██████████░░░░░░░░░░ 40%
```

---

## 🎉 Next Steps

1. ✅ Complete setup using guides above
2. ✅ Verify everything works
3. ✅ Create test quizzes
4. ✅ Test as both user and admin
5. 🔜 Start Phase 3 (Course Integration)

---

**Last Updated:** December 5, 2025  
**System Status:** ✅ Ready to Use  
**Documentation Status:** ✅ Complete

---

**Need help?** Start with `SETUP_VISUAL_GUIDE.md` and follow along step-by-step! 🚀
