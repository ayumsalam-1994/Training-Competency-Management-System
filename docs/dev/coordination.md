# Team Coordination & Handoff Plan

This document describes who starts which tasks, the expected handoffs between members, and when members should update their task status or wait for dependencies. Work is organized by stage, with clear handoff points and dependencies.

---

## 📋 Principles

- Work stage-by-stage: Stage 1 → Stage 2 → Stage 3 → Stage 4 → Stage 5. Within a stage, members may work in parallel where dependencies allow.
- Always update your `docs/dev/<member>/phase-<n>-todo.md` when a task is complete, blocked, or in-progress.
- Formal handoffs should happen through Pull Requests (PRs) and reviewer assignment.

---

## 🚀 Stage-by-Stage Execution Plan

### Stage 1: Project Foundation (Week 1)

**Start:** All members in parallel

**Key participants:**
- Qayyum — Auth system, JWT guards, role seeds
- Leo — Course models and basic CRUD
- Hariz — Quiz module scaffolding
- Hanif — Competency scaffold and certificate placeholder
- Suren — Analytics scaffold

**Handoff points:**
1. Qayyum completes auth guards and roles; other members integrate guards into their endpoints.
2. Each module provides event hooks/metrics for Suren.

**Acceptance:** Users can register/login; each module has stable placeholders.

---

### Stage 2: Course Management (Week 2)

**Start:** Leo leads; others follow

**Key participants:**
- Leo — Full Course CRUD, modules, lessons, resources, search, enrollment
- Hariz — Link quizzes to modules after Leo finalizes course structure
- Hanif — Map competencies to course outcomes after course structure is stable
- Suren — Build course metrics when enrollment data is available

**Handoff points:**
1. Leo → Hariz and Hanif: stable module endpoints
2. Leo → Suren: enrollment/metrics contract

**Acceptance:** Course CRUD works; data flows to analytics.

---

### Stage 3: Quiz & Assessment (Week 3)

**Start:** Hariz leads

**Key participants:** Hariz (Quiz), Hanif (Competency), Suren (Analytics), Qayyum (Auth)

**Handoff points:**
1. Hariz → Hanif: quiz results for competency verification
2. Hariz → Suren: quiz metrics

**Acceptance:** Quiz attempts persist results; metrics available.

---

### Stage 4: Competency & Certification (Week 4)

**Start:** Hanif leads

**Key participants:** Hanif (Certificates), Leo (Course), Qayyum (Auth), Suren (Analytics)

**Handoff points:**
1. Hanif → Qayyum: secure certificate downloads and audit requirements
2. Hanif → Suren: certification metrics

**Acceptance:** Certificates generated/downloadable; expiry reminders scheduled.

---

### Stage 5: Analytics & Polish (Week 5)

**Start:** Suren leads final composition; all support

**Handoff points:** All modules provide polished sample data and metrics to Suren for final charts and CSV export.

**Acceptance:** Presentation-ready dashboard and full documentation.

---

## 📌 Update Rules (Status & Blocking)

- Mark tasks complete: change `- [ ]` to `- [x]` and add a short note (example: `✅ DONE 2025-11-18 — Implemented /auth/login`).
- Mark tasks blocked: prefix with `BLOCKED:` and name the member or PR blocking it.
- Mark tasks in-progress: prefix with `IN PROGRESS:` and short status.
- For blocking dependencies: assign the dependent member as a reviewer on the blocking PR and add a comment describing required contract or data.

---

## 🔁 Handoff Workflow (GitHub-centric)

1. Develop in a feature branch: `feature/<member>-<task>`
2. Open a PR to `stage-1/init` with links to relevant todos and PRD sections
3. Assign dependent members as reviewers for verification
4. Once merged to `stage-1/init`, dependent members update their todo items and proceed

---

## 📊 Quick Dependency Reference

| Member | Role | Blocks | Depends on |
|--------|------|--------|------------|
| Qayyum | Auth | All major protected endpoints | — |
| Leo | Course | Hariz, Hanif, Suren | Qayyum (auth) |
| Hariz | Quiz | Hanif, Suren | Qayyum (auth), Leo (course structure) |
| Hanif | Competency | Suren | Qayyum (auth), Leo (course), Hariz (quiz results) |
| Suren | Analytics | — | All modules (metrics)

---

## 🧭 Communication & Escalation

- Use GitHub PR comments and Issues for formal design and contract changes.
- Use chat for urgent blocks and mark todo as `BLOCKED` with a reference to the chat.
- If blocked >1 day, escalate to team lead in chat/Issue.

---

## ✅ Stage Sign-off Checklist

Before moving to the next stage, verify:
- [ ] All tasks in the current stage are marked complete or documented as blocked
- [ ] All PRs from stage are merged into `stage-1/init` and verified by dependent members
- [ ] Metrics hooks are available for analytics
- [ ] Documentation (README, PRD) updated if any contract changes occurred

---

_Last updated: 2025-11-18_
