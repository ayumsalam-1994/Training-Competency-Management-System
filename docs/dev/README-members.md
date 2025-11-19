# Team Member Guide — Development (Docs)

This guide helps the team work consistently on the Training Competency Management System. It explains the repo layout for dev docs, how to update your per-phase todo lists, PR/branching conventions, and the handoff process.

**🎉 PHASE 1 AUTH SYSTEM COMPLETE! 🎉**
The Angular frontend and MySQL backend auth system is now fully functional. See the [Team Startup Guide](./TEAM-STARTUP-GUIDE.md) for complete setup instructions and API documentation.

**File locations**
- **NEW**: Team Startup Guide: `docs/dev/TEAM-STARTUP-GUIDE.md` ⭐ **START HERE**
- Project PRD: `docs/dev/PRD.md`
- Member todo lists: `docs/dev/<member>/phase-<n>-todo.md` (e.g., `docs/dev/qayyum/phase-1-todo.md`)
- Team coordination doc: `docs/dev/coordination.md`

Quick principles
- Work stage-by-stage: Stage 1 → Stage 2 → Stage 3 → Stage 4 → Stage 5.
- Keep docs authoritative: update your `phase-<n>-todo.md` when a task is complete, blocked, or in-progress.
- Use PRs as handoffs: assign dependent members as reviewers so they can validate API contracts before proceeding.

How to update your phase todo file
1. Open your file, e.g. `docs/dev/qayyum/phase-2-todo.md`.
2. Mark status with one of: `- [x]` (done), `- [ ] IN PROGRESS:`, or `- [ ] BLOCKED: <reason>`.
3. Add a one-line note under the item when completing or blocking it: e.g. `✅ DONE 2025-11-18 — Implemented /auth/login`.
4. Save the file and commit (see commands below).

Branch & PR workflow (recommended)
- Branch naming: `feature/<member>-<short-desc>` or `fix/<member>-<short-desc>` (e.g., `feature/qayyum-auth-login`).
- Base branch for initial work: `stage-1/init`.
- Commit messages: `type(scope): short description` — examples:
  - `chore(docs): add qayyum phase-1 todos`
  - `feat(auth): add login endpoint`
- Open a PR to `stage-1/init` with a clear summary, link to the PRD and the relevant `phase-<n>-todo.md`, and assign dependent reviewers.

Commands (PowerShell)
- Create a branch and switch to it:
```powershell
git checkout -b feature/qayyum-auth-login
```
- Stage and commit your changes:
```powershell
git add docs/dev/qayyum/phase-1-todo.md
git commit -m "chore(docs): update qayyum phase-1 status"
```
- Push the branch and open PR:
```powershell
git push -u origin feature/qayyum-auth-login
# then open PR on GitHub and target stage-1/init
```

Handoff rules (short)
- If your work depends on another member, mark the todo `BLOCKED` and mention the blocking member in the file (and in Slack/Teams).
- When the blocking PR is merged to `stage-1/init`, update your todo and proceed.
- Prefer small, reviewable PRs that make integration simpler.

Communication & reviews
- Use PR comments for design and API contract discussions.
- For urgent blocks, notify the blocking member via chat and add a short note in the todo file.
- Add reviewers who will consume your API (not just the project lead).

Acceptance & sign-off
- When a feature/endpoint is ready for others, create a PR and in the PR description include:
  - Which `phase-<n>-todo.md` task this implements
  - Acceptance criteria (copy from the todo file)
  - Any manual verification steps
- After merge, dependent members should update their todo entries and proceed.

Extras
- If you want me to format or reword any member's todo files into a consolidated index, tell me which layout you prefer (flat list vs. per-member index).

---
File created: `docs/dev/README-members.md` — feel free to request edits or specify extra sections.

## Quick plan — who starts what next (UPDATED - Auth Complete!)

The core auth system has been implemented and tested! Team members can now begin their individual Phase 1 tasks using the established auth foundation.

**✅ COMPLETED by Qayyum:**
- Angular 20.3.0 frontend with standalone components
- MySQL backend with users/roles tables
- JWT authentication with login/register endpoints
- Auth guard and protected routes
- Manual testing dashboard with API test buttons

**🚀 READY TO START - Phase 1 Tasks:**

- **Leo (Member B)** — Frontend UI Components: Build course listing, user dashboard, and enrollment components using the existing auth system. The auth service and protected routes are ready for integration.
  - Start with: Course listing component and integrate with auth service for user state

- **Hariz (Member C)** — Database Schema Expansion: Add course, quiz, and enrollment tables to the existing MySQL database. Build API endpoints for course management.
  - Start with: Course schema and `/api/courses` endpoints using existing auth middleware

- **Hanif (Member D)** — DevOps Setup: Containerize the Angular/Express/MySQL stack with Docker and set up CI/CD pipeline for deployment.
  - Start with: Docker Compose setup for the complete auth system

- **Suren (Member E)** — Testing Framework: Set up Jest/Cypress testing for the auth system and create test templates for other modules.
  - Start with: API tests for existing auth endpoints and component tests for login/register

### Next Steps Instructions
1. **Follow the [Team Startup Guide](./TEAM-STARTUP-GUIDE.md)** to set up your local environment
2. **Test the manual dashboard** at `http://localhost:4200/dashboard` to verify auth system works
3. **Review API documentation** in the startup guide for integration patterns
4. **Update your individual phase-1-todo.md** files as you complete tasks
5. **Create feature branches** following the naming convention below

### Integration Notes
- **Auth Service**: Import from `frontend/src/app/services/auth.ts` for user state and JWT management
- **Protected Routes**: Use existing auth guard pattern in your new route configurations  
- **API Middleware**: Backend auth middleware is ready at `backend/src/middleware/auth.js`
- **Database Connection**: MySQL pool and helper functions available in `backend/src/utils/db.js`


