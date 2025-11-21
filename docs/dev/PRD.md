# Product Requirements Document (PRD)
## Training & Competency Management System (TCMS)

**Version:** 1.0  
**Status:** In Development  
**Last Updated:** November 17, 2025  
**Project Owner:** Development Team  

---

## 📋 Executive Summary

The Training & Competency Management System (TCMS) is a comprehensive full-stack application designed to streamline employee training, skills tracking, and competency management. This system empowers organizations to efficiently manage employee learning journeys while providing managers with actionable insights through analytics and reporting.

The project serves as a professional portfolio piece demonstrating real-world modular development, clean architecture, and production-quality engineering practices.

---

## 🎯 Project Objectives

### Primary Goals
1. **Enable Employee Training & Development**
   - Allow employees to enroll in courses
   - Provide interactive quiz and assessment mechanisms
   - Track skill acquisition and competency progress

2. **Facilitate Competency Management**
   - Map competencies to job roles
   - Track user progress against competency frameworks
   - Generate certificates upon completion
   - Send automated expiry reminders

3. **Provide Business Intelligence**
   - Deliver analytics dashboards for training metrics
   - Generate reports on enrollment, completion rates, and pass rates
   - Export data for further analysis

4. **Demonstrate Engineering Excellence**
   - Showcase modular, scalable architecture
   - Implement professional development practices
   - Maintain clean, maintainable, well-documented code

---

## 👥 User Personas & Use Cases

### Persona 1: Employee
**Goal:** Develop skills and obtain certifications  
**Use Cases:**
- Browse available courses
- Enroll in relevant courses
- Complete course modules and lessons
- Take quizzes and assessments
- View competency progress dashboard
- Download certificates
- Receive notifications about expiring certifications

### Persona 2: Manager/Admin
**Goal:** Track team training progress and manage competencies  
**Use Cases:**
- Create and manage courses
- Assign courses to employees or teams
- Review training completion rates
- View analytics and generate reports
- Manage competency frameworks
- Configure system settings

### Persona 3: System Administrator
**Goal:** Maintain system health and data integrity  
**Use Cases:**
- User account management
- Role-based access control
- System configuration
- Data backup and recovery
- Monitor system performance

---

## 🎮 Feature Requirements

### Feature 1: User Authentication & Authorization
**Description:** Secure login system with role-based access control  
**Functional Requirements:**
- User registration and account creation
- Email/password-based login
- JWT token-based authentication
- Role-based access control (Employee, Manager, Admin)
- Password reset functionality
- Session management

**Acceptance Criteria:**
- ✅ Users can register with valid email and password
- ✅ Registered users can login successfully
- ✅ Invalid credentials are rejected
- ✅ JWT tokens are issued and validated
- ✅ Role-based permissions are enforced

---

### Feature 2: Course Management
**Description:** Comprehensive course creation, organization, and delivery system  
**Functional Requirements:**
- Course CRUD operations (Create, Read, Update, Delete)
- Hierarchical organization: Course → Modules → Lessons
- Support for multiple content types (PDFs, videos, links, text)
- Course metadata (description, duration, difficulty level, prerequisites)
- Search and filtering functionality
- Category-based organization
- Course enrollment management

**Acceptance Criteria:**
- ✅ Admins can create and publish courses
- ✅ Employees can search and filter courses
- ✅ Employees can enroll in courses
- ✅ Course content is properly organized and displayed
- ✅ Enrollment status is tracked

---

### Feature 3: Quiz & Assessment Module
**Description:** Interactive quiz creation and attempt management system  
**Functional Requirements:**
- Quiz creation with multiple question types (MCQ, true/false, short answer)
- Question randomization and shuffling options
- Multiple attempts support
- Time-based quiz sessions
- Auto-grading for objective questions
- Answer review and feedback
- Quiz attempt history
- Performance analytics per quiz

**Acceptance Criteria:**
- ✅ Admins can create and configure quizzes
- ✅ Users can attempt quizzes with proper time tracking
- ✅ Results are calculated and displayed correctly
- ✅ Users can review their answers and feedback
- ✅ Attempt history is maintained

---

### Feature 4: Competency & Certification Module
**Description:** Track competencies, skill development, and certification lifecycle  
**Functional Requirements:**
- Competency framework definition
- Map competencies to job roles
- Track user competency proficiency levels
- Competency achievement verification
- Certificate generation and PDF export
- Certificate issuance date tracking
- Expiry date management and reminders
- Automated notification system for expiring certificates

**Acceptance Criteria:**
- ✅ Admins can define competency frameworks
- ✅ System tracks user competency progress
- ✅ Certificates are generated upon completion
- ✅ Users can download certificates as PDFs
- ✅ Notifications are sent for expiring certificates

---

### Feature 5: Analytics & Reporting Dashboard
**Description:** Comprehensive analytics and insights for training metrics  
**Functional Requirements:**
- Dashboard with key metrics visualization
- Course enrollment analytics
- Course completion rates
- Quiz pass rate analytics
- Competency completion tracking
- User performance trends
- CSV export functionality
- Custom report generation
- Time-period based filtering

**Acceptance Criteria:**
- ✅ Managers can view comprehensive analytics dashboard
- ✅ Charts and graphs display accurate data
- ✅ Data can be exported in CSV format
- ✅ Reports can be filtered by time period and category

---

### Feature 6: Attendance & Time Tracking System
**Description:** Employee check-in/checkout system for training session attendance and work time tracking  
**Functional Requirements:**
- Employee check-in/check-out functionality
- Manual and automated time tracking
- Daily, weekly, and monthly attendance reports
- Integration with training sessions and courses
- Attendance history and analytics
- Late arrival and early departure tracking
- Break time management
- Overtime calculation
- Manager approval workflow for time adjustments

**Acceptance Criteria:**
- ✅ Employees can check-in and check-out with timestamp recording
- ✅ Location validation ensures check-ins are from authorized locations
- ✅ System tracks total work hours and break times
- ✅ Attendance reports can be generated and exported
- ✅ Managers can view team attendance analytics
- ✅ Integration with training sessions for accurate attendance tracking

---

## 🏗️ Technology Stack

### Frontend
- **Framework:** Angular 17+
- **UI Components:** Angular Material
- **Charts & Visualization:** Chart.js / ngx-charts
- **HTTP Client:** Angular HttpClientModule
- **State Management:** Angular Services / RxJS
- **Routing:** Angular Router
- **Forms:** Reactive Forms

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **API Documentation:** Swagger/OpenAPI
- **Authentication:** JWT (JSON Web Tokens)

### Database
- **Primary:** MySQL
- ~~**ORM/Query Builder: Sequelize, TypeORM, or Mongoose~~ We will not be using any ORM
- **Migrations:** Database versioning tools

### DevOps & Tools
- **Containerization:** Docker (optional)
- **Version Control:** Git
- **Package Management:** npm ~~/yarn~~
- **Testing:** Jest, Jasmine, Karma
- **Code Quality:** ESLint, Prettier

---

## 📡 API Specifications

### Authentication Endpoints
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|----------------|
| `/auth/login` | POST | User login | No |
| `/auth/register` | POST | User registration | No |
| `/auth/profile` | GET | Get current user profile | Yes |
| `/auth/logout` | POST | User logout | Yes |
| `/auth/refresh-token` | POST | Refresh JWT token | Yes |

### Course Endpoints
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|----------------|
| `/courses` | GET | List all courses | Yes |
| `/courses` | POST | Create new course | Yes (Admin) |
| `/courses/:id` | GET | Get course details | Yes |
| `/courses/:id` | PUT | Update course | Yes (Admin) |
| `/courses/:id` | DELETE | Delete course | Yes (Admin) |
| `/courses/:id/enroll` | POST | Enroll user in course | Yes |
| `/courses/:courseId/modules` | GET | Get course modules | Yes |

### Quiz Endpoints
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|----------------|
| `/quizzes` | GET | List all quizzes | Yes |
| `/quizzes` | POST | Create quiz | Yes (Admin) |
| `/quizzes/:id` | GET | Get quiz details | Yes |
| `/quizzes/:id/attempt` | POST | Submit quiz attempt | Yes |
| `/quizzes/:id/attempts` | GET | Get user's quiz attempts | Yes |
| `/quizzes/:id/results` | GET | Get quiz results | Yes |

### Competency Endpoints
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|----------------|
| `/competencies` | GET | List competencies | Yes |
| `/competencies` | POST | Create competency | Yes (Admin) |
| `/competencies/:id/assign` | POST | Assign competency to user | Yes (Admin) |
| `/user/competencies` | GET | Get user competencies | Yes |
| `/certificates` | GET | List user certificates | Yes |
| `/certificates/:id/download` | GET | Download certificate PDF | Yes |

### Analytics Endpoints
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|----------------|
| `/analytics/overview` | GET | Dashboard overview metrics | Yes (Manager) |
| `/analytics/courses` | GET | Course enrollment analytics | Yes (Manager) |
| `/analytics/competencies` | GET | Competency completion analytics | Yes (Manager) |
| `/analytics/users` | GET | User performance metrics | Yes (Manager) |
| `/analytics/export` | GET | Export analytics as CSV | Yes (Manager) |

### Attendance Endpoints
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|----------------|
| `/attendance/checkin` | POST | Employee check-in | Yes |
| `/attendance/checkout` | POST | Employee check-out | Yes |
| `/attendance/status` | GET | Get current attendance status | Yes |
| `/attendance/history` | GET | Get attendance history | Yes |
| `/attendance/report` | GET | Generate attendance report | Yes (Manager) |
| `/attendance/team-report` | GET | Team attendance analytics | Yes (Manager) |
| `/attendance/approve` | POST | Approve time adjustments | Yes (Manager) |

---

## 🎨 Frontend Application Structure

```
src/app/
├── auth/
│   ├── login/
│   ├── register/
│   ├── guards/
│   ├── services/
│   └── interceptors/
├── courses/
│   ├── course-list/
│   ├── course-detail/
│   ├── course-create/
│   ├── module-list/
│   └── services/
├── quizzes/
│   ├── quiz-list/
│   ├── quiz-attempt/
│   ├── quiz-result/
│   └── services/
├── competencies/
│   ├── competency-list/
│   ├── competency-detail/
│   ├── certificate-list/
│   └── services/
├── attendance/
│   ├── checkin-checkout/
│   ├── attendance-history/
│   ├── time-tracking/
│   ├── attendance-reports/
│   └── services/
├── dashboard/
│   ├── analytics/
│   ├── user-dashboard/
│   ├── admin-dashboard/
│   └── services/
├── shared/
│   ├── components/
│   ├── directives/
│   ├── pipes/
│   ├── services/
│   ├── models/
│   └── constants/
├── layouts/
│   ├── main-layout/
│   └── sidebar/
├── app.component.ts
├── app.routing.ts
└── app.module.ts
```

---

## 🤖 Backend Application Structure

```
backend/
├── src/
│   ├── auth/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   ├── guards/
│   │   └── strategies/
│   ├── courses/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   └── dto/
│   ├── quizzes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   └── dto/
│   ├── competencies/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   └── dto/
│   ├── analytics/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── dto/
│   ├── attendance/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   └── dto/
│   ├── users/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   └── dto/
│   ├── common/
│   │   ├── middleware/
│   │   ├── decorators/
│   │   ├── exceptions/
│   │   ├── pipes/
│   │   └── utils/
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeds/
│   │   └── models/
│   ├── app.module.ts
│   └── main.ts
├── tests/
├── docker-compose.yml
├── .env.example
├── package.json
└── README.md
```

---

## 📅 Development Stages & Deliverables

### Stage 1: Project Foundation (Week 1)
**Objective:** Set up all project infrastructure and authentication

**Deliverables:**
- ✅ Angular workspace initialized
- ✅ Backend API initialized (Express/NestJS)
- ✅ Database schema created
- ✅ Authentication system implemented (JWT + roles)
- ✅ Environment configuration setup
- ✅ Working login flow

**Success Criteria:**
- User can register and login successfully
- JWT tokens are generated and validated
- Role-based access is enforced

---

### Stage 2: Course Management Module (Week 2)
**Objective:** Build complete course creation and management system

**Deliverables:**
- ✅ Course CRUD operations
- ✅ Module and lesson management
- ✅ File/resource management (PDFs, videos, links)
- ✅ Course search and filtering
- ✅ Enrollment system
- ✅ Angular UI for course listing and detail pages

**Success Criteria:**
- Admins can create, edit, and delete courses
- Employees can search and browse courses
- Employees can enroll in courses
- Course content is properly organized

---

### Stage 3: Quiz & Assessment Module (Week 3)
**Objective:** Implement comprehensive quiz and assessment system

**Deliverables:**
- ✅ Quiz creation and configuration
- ✅ MCQ support with multiple question types
- ✅ Quiz attempt submission system
- ✅ Auto-grading functionality
- ✅ Result history and feedback
- ✅ Quiz UI components

**Success Criteria:**
- Quiz creation workflow is complete
- Users can attempt quizzes with proper tracking
- Results are calculated and displayed correctly
- Users can review their answers

---

### Stage 4: Competency & Certification Module (Week 4)
**Objective:** Implement competency tracking and certificate management

**Deliverables:**
- ✅ Competency framework definition
- ✅ Competency assignment to job roles
- ✅ User progress tracking
- ✅ Certificate generation and PDF export
- ✅ Expiry notification system (cron jobs)
- ✅ Competency dashboard

**Success Criteria:**
- Competencies are mapped to job roles
- Certificates are generated and can be downloaded
- Expiry reminders are sent automatically

---

### Stage 5: Analytics Dashboard & Polish (Week 5)
**Objective:** Complete analytics system and production readiness

**Deliverables:**
- ✅ Analytics dashboard with charts and metrics
- ✅ Course enrollment analytics
- ✅ Pass rate analytics
- ✅ Competency completion tracking
- ✅ CSV export functionality
- ✅ UI polishing with Angular Material
- ✅ Sample data and demo accounts
- ✅ Comprehensive documentation
- ✅ README and demo scripts

**Success Criteria:**
- Dashboard displays accurate analytics
- Data can be exported successfully
- UI is polished and professional
- System is ready for presentation

---

## 👥 Team Structure & Responsibilities

### Member A: Authentication & User Management + Attendance System [Hanif]
**Modules:**
- User registration and login
- JWT authentication guards
- Role-based access control
- User CRUD operations
- Password management
- Employee check-in/checkout system
- Attendance tracking and analytics
- Time management and reporting
- Location-based validation

**Deliverables:**
- Auth service
- Auth guards
- User controller/service
- Auth middleware
- Attendance controller/service
- Time tracking system
- Attendance reports and analytics

---

### Member B: Course Management Module [LEO]
**Modules:**
- Course creation and management
- Module and lesson organization
- File/resource management
- Course search and filtering
- Enrollment system

**Deliverables:**
- Course controller/service
- Course models and database schema
- Course UI components
- Enrollment service

---

### Member C: Quiz & Assessment Module [HARIZ]
**Modules:**
- Quiz builder and configuration
- Question management (MCQ, true/false, etc.)
- Quiz attempt and submission
- Auto-grading logic
- Result management

**Deliverables:**
- Quiz controller/service
- Question models and schema
- Quiz attempt logic
- Quiz UI components

---

### Member D: Competency & Certification Module [Qayyum]
**Modules:**
- Competency framework definition
- Competency assignment
- Certificate generation
- PDF generation
- Expiry notification system

**Deliverables:**
- Competency controller/service
- Certificate generation service
- Notification/cron job system
- Competency dashboard UI

---

### Member E: Analytics & Reporting Module [SUREN]
**Modules:**
- Analytics data collection and processing
- Dashboard visualization
- Report generation
- CSV export
- Performance metrics calculation

**Deliverables:**
- Analytics controller/service
- Chart components
- Export functionality
- Dashboard UI

---

## 📊 Success Metrics

### System Performance
- Response time: < 500ms for API endpoints
- Database query time: < 200ms
- Page load time: < 2 seconds
- System uptime: > 99.5%

### User Adoption
- User registration completion rate: > 80%
- Course enrollment rate: > 60%
- Quiz completion rate: > 70%
- Certificate generation success: 100%

### Data Quality
- Data accuracy: 100%
- Export success rate: 99%
- Zero data loss incidents
- Backup recovery time: < 1 hour

### Code Quality
- Test coverage: > 80%
- Code review approval rate: 100%
- Zero critical bugs in production
- Documentation completeness: 100%

---

## 🔒 Security Requirements

- **Authentication:** JWT-based authentication with secure token storage
- **Authorization:** Role-based access control (RBAC)
- **Data Protection:** Encryption of sensitive data at rest and in transit
- **Input Validation:** Server-side validation of all inputs
- **SQL Injection Prevention:** Parameterized queries / ORM usage
- **CSRF Protection:** CSRF tokens for state-changing operations
- **Password Security:** Bcrypt hashing with salting
- **API Rate Limiting:** Prevent brute force and DoS attacks
- **Audit Logging:** Track user actions and system events

---

## ⚙️ Non-Functional Requirements

### Scalability
- Support minimum 1,000 concurrent users
- Database optimization for large datasets
- Caching strategy (Redis optional)
- Load balancing ready architecture

### Maintainability
- Clean, modular code architecture
- Comprehensive documentation
- Unit and integration tests
- Clear separation of concerns

### Usability
- Intuitive user interface
- Responsive design (mobile, tablet, desktop)
- Accessibility compliance (WCAG 2.1)
- Fast navigation and load times

### Reliability
- Error handling and graceful degradation
- Data validation and consistency
- Automated backups
- Disaster recovery plan

---

## 📝 Constraints & Assumptions

### Technical Constraints
- Team size: 5 developers
- Timeline: 5 weeks
- Single database per team
- No external learning management system integration required

### Assumptions
- Team has basic knowledge of Angular and Node.js
- Database server is available and accessible
- Email service is available for notifications
- SMTP server is configured for sending emails

---

## 🚀 Launch & Deployment

### Pre-Launch Checklist
- ✅ All features tested and QA approved
- ✅ Security audit completed
- ✅ Performance testing passed
- ✅ Documentation finalized
- ✅ Backup and recovery tested
- ✅ User training materials prepared

### Deployment Strategy
- Blue-green deployment approach
- Database migration scripts prepared
- Rollback procedure documented
- Monitoring and alerting configured

### Post-Launch Support
- Monitor system performance
- Collect user feedback
- Bug tracking and resolution
- Performance optimization

---

## 📚 Reference Documents

- [Main Idea Document](../main-idea.md)
- Technical Architecture Document (TBD)
- Database Schema Document (TBD)
- API Documentation (Swagger/OpenAPI)
- Testing Strategy Document (TBD)
- Deployment Guide (TBD)

---

## 📞 Contact & Support

**Project Lead:** Development Team  
**Repository:** Ai-course-Q001  
**Branch:** master  

---

## 📜 Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Nov 17, 2025 | Development Team | Initial PRD creation |

---

**End of Document**
