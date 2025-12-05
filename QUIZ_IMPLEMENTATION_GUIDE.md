# Quiz Module - Implementation & Testing Guide

## What Was Implemented

### Backend (Express.js)
1. **Database Schema** (6 tables with proper relationships):
   - `quizzes` - Quiz metadata (title, duration, passing_score, difficulty)
   - `questions` - Quiz questions (supports MCQ, true_false, short_answer)
   - `quiz_options` - Answer options for MCQ questions
   - `quiz_attempts` - User quiz sessions with scores
   - `quiz_answers` - Individual user answers
   - `roles` & `users` - Existing auth tables

2. **Backend Routes** (`/quiz` endpoints):
   - `GET /quiz` - List all quizzes (public)
   - `GET /quiz/:quizId` - Get quiz details (public)
   - `GET /quiz/:quizId/questions` - Get questions with options (public)
   - `POST /quiz/:quizId/attempt/start` - Start a quiz (requires auth)
   - `POST /quiz/:quizId/attempt/:attemptId/answer` - Submit an answer (requires auth)
   - `POST /quiz/:quizId/attempt/:attemptId/submit` - Complete quiz & calculate score (requires auth)
   - `GET /quiz/:quizId/attempt/:attemptId/results` - Get attempt results (requires auth)
   - `GET /quiz/:quizId/my-attempts` - Get user's all attempts (requires auth)

3. **Database Functions** in `src/utils/db.js`:
   - Quiz CRUD operations
   - Question management
   - Quiz option handling
   - Attempt creation and completion
   - Answer submission and scoring

### Frontend (Angular)
1. **Components**:
   - **QuizListComponent** - Browse available quizzes
   - **QuizAttemptComponent** - Take a quiz with real-time timer
   - **QuizResultsComponent** - View detailed results with answer review

2. **Quiz Service** - HTTP calls to backend API

3. **Routes** in `app.routes.ts`:
   - `/quiz` - Quiz list page
   - `/quiz/:quizId` - Quiz attempt page
   - `/quiz/:quizId/attempt/:attemptId/results` - Results page

### Sample Data
- **3 sample quizzes** ready to seed:
  - JavaScript Fundamentals (5 questions, 20 min, 70% passing)
  - React Components & Hooks (4 questions, 15 min, 75% passing)
  - HTML & CSS Fundamentals (3 questions, 10 min, 60% passing)

## How to Test

### Step 1: Start Backend with Database Initialization
```powershell
cd backend
npm run dev
```
This will:
- Create all 6 quiz-related tables
- Start the server on http://localhost:4000

### Step 2: Seed Sample Quizzes
```powershell
cd backend
npm run seed-quiz
```
Output:
```
Starting quiz seeding...
Created Quiz 1: 1
✓ Quiz 1 seeded with 5 questions
Created Quiz 2: 2
✓ Quiz 2 seeded with 4 questions
Created Quiz 3: 3
✓ Quiz 3 seeded with 3 questions

✅ Quiz seeding completed successfully!
```

### Step 3: Start Frontend
```powershell
cd frontend
npm start
```
Access at http://localhost:4200

### Step 4: Test Quiz Workflow

#### A. View Quiz List
- Navigate to http://localhost:4200/quiz
- See all 3 quizzes displayed with difficulty levels
- Each quiz shows: title, description, duration, passing score

#### B. Register & Login
- Click "Take Quiz" (redirects to login if not authenticated)
- Register: Email: test@quiz.com, Password: TestPass123
- Login with credentials
- You're now authenticated

#### C. Take a Quiz
- Click "Take Quiz" on any quiz
- You'll see:
  - Quiz title and timer (countdown)
  - Question text with type (MCQ/True-False)
  - Answer options
  - Progress bar
  - Navigation buttons (Previous/Next/Submit)

#### D. Answer Questions
- Click on an option to select it
- Use Next/Previous to navigate
- Questions are required before submitting
- Timer auto-submits when it reaches 0

#### E. View Results
- After submission, you'll see:
  - Overall score (e.g., 80%)
  - Pass/Fail status (based on passing_score)
  - Detailed answer review with explanations
  - Correct vs user's answer comparison
  - Option to retake quiz

### Step 5: Test Authenticated Endpoints
Use Postman or curl to test:

#### Register User
```
POST http://localhost:4000/auth/register
Body: {"email":"test@quiz.com", "password":"Test123"}
```

#### Login
```
POST http://localhost:4000/auth/login
Body: {"email":"test@quiz.com", "password":"Test123"}
Response: { token: "eyJ..." }
```

#### Get All Quizzes (Public)
```
GET http://localhost:4000/quiz
No auth needed
Response: 3 quizzes
```

#### Start Quiz Attempt (Protected)
```
POST http://localhost:4000/quiz/1/attempt/start
Header: Authorization: Bearer <token>
Response: {
  "attempt_id": 1,
  "quiz": {...},
  "questions": [...]
}
```

#### Submit Answer
```
POST http://localhost:4000/quiz/1/attempt/1/answer
Header: Authorization: Bearer <token>
Body: {
  "question_id": 1,
  "user_answer": "A"
}
Response: { "is_correct": true, "feedback": "..." }
```

#### Submit Quiz
```
POST http://localhost:4000/quiz/1/attempt/1/submit
Header: Authorization: Bearer <token>
Response: {
  "score": 4,
  "total_questions": 5,
  "percentage": 80,
  "passed": true,
  "answers": [...]
}
```

## Key Features

✅ **Question Types Supported**:
- Multiple Choice (MCQ)
- True/False
- Short Answer

✅ **Time Management**:
- Optional quiz duration (total time limit)
- Optional per-question time limits (stored but frontend can extend)
- Timer countdown display
- Auto-submit on time expiry

✅ **Scoring System**:
- Automatic grading for MCQ & True/False
- Manual grading needed for short answer (stored as submitted text)
- Configurable passing score per quiz
- Percentage calculation

✅ **Security**:
- Quiz browsing is public (no auth needed)
- Attempt creation requires authentication
- User can only view their own results
- JWT token validation on all protected endpoints

✅ **User Features**:
- Multiple quiz attempts allowed
- View attempt history
- Review answers with explanations
- Retake quiz option

## Database Schema Details

### quizzes
```sql
id INT (PK)
title VARCHAR(255)
description TEXT
duration INT (minutes, optional)
passing_score INT (default 60)
difficulty VARCHAR(50) (easy/medium/hard)
created_by INT (FK to users)
created_at TIMESTAMP
```

### questions
```sql
id INT (PK)
quiz_id INT (FK to quizzes, CASCADE DELETE)
question_text TEXT
question_type ENUM (mcq, true_false, short_answer)
correct_answer VARCHAR(500)
explanation TEXT
time_limit INT (seconds, optional)
created_at TIMESTAMP
```

### quiz_options
```sql
id INT (PK)
question_id INT (FK to questions, CASCADE DELETE)
option_text VARCHAR(500)
is_correct BOOLEAN
```

### quiz_attempts
```sql
id INT (PK)
user_id INT (FK to users, CASCADE DELETE)
quiz_id INT (FK to quizzes, CASCADE DELETE)
started_at TIMESTAMP
completed_at TIMESTAMP (NULL if in progress)
score INT
percentage DECIMAL(5,2)
status ENUM (in_progress, completed, abandoned)
```

### quiz_answers
```sql
id INT (PK)
attempt_id INT (FK to quiz_attempts, CASCADE DELETE)
question_id INT (FK to questions, CASCADE DELETE)
user_answer VARCHAR(500)
is_correct BOOLEAN
answered_at TIMESTAMP
```

## Notes for Next Phases

- **Phase 2**: Can add admin endpoints to create/edit quizzes without seeding
- **Phase 3**: Can add quiz categories and filtering
- **Phase 4**: Can add analytics on quiz performance
- **Phase 5**: Can integrate certificates on quiz completion
