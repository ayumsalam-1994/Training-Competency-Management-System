# Team Member Guide — Development (Docs)

This guide helps the team work consistently on the Training Competency Management System. It explains the repo layout for dev docs, how to update your per-phase todo lists, PR/branching conventions, and the handoff process.

**File locations**
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

## Quick plan — who starts what first

This short plan assigns who should begin work first and why. Use it to prioritize sprint-day 1 tasks.

- **Qayyum (Member A)** — Start first: implement core auth (`/auth/register`, `/auth/login`), JWT issuance, password hashing, and seed roles. Other modules depend on auth and RBAC.
  - Deliverable: working login/register endpoints, seeded roles, basic auth guard.

- **Leo (Member B)** — Start in parallel (scaffold and basic endpoints): create course model, initial migration, and basic `/courses` endpoints and UI placeholders. Once Qayyum provides auth, protect admin routes.
  - Deliverable: `/courses` GET/POST endpoints and sample UI.

- **Hariz (Member C)** — Start in parallel (scaffold): scaffold quiz module and expose sample `/quizzes` endpoints so other members can verify contracts.
  - Deliverable: placeholder quiz endpoints and UI.

- **Hanif (Member D)** — Start in parallel (scaffold): scaffold competency and certificate models and a placeholder certificate generation endpoint.
  - Deliverable: competency/certificate schema and placeholder endpoints.

- **Suren (Member E)** — Start in parallel (scaffold): scaffold analytics module and define initial metrics schema so other members know what telemetry to emit.
  - Deliverable: analytics routes and stub metrics.

### First practical sequence
1. Qayyum finishes basic auth (guards + roles).
2. Leo, Hariz, Hanif, Suren integrate auth checks into their endpoints.
3. Leo finalizes course endpoints; Hariz and Hanif consume course data.
4. Hariz implements quiz attempts/results; Hanif uses results to verify competencies.
5. Hanif implements certificate generation and expiry flows; Suren collects certificate metrics.
6. Suren finalizes dashboard and polish.

### Short immediate tasks (copy-paste to your phase todo)
- Qayyum: implement `/auth/register` + `/auth/login` and seed roles.
- Leo: create `courses` model + `/courses` GET returning sample data.
- Hariz: create `/quizzes` GET returning sample quiz objects.
- Hanif: add `competencies` model and placeholder `/certificates/generate` endpoint.
- Suren: define analytics schema and create `/analytics/overview` stub.


