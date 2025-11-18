# Qayyum — Phase 1 (Stage 1) TODO

**Owner**: Qayyum (Member A) — Authentication & User Management

**Stage**: Project Foundation (Week 1)

## Checklist

- [ ] Initialize auth service and controller
- [ ] Implement registration endpoint `/auth/register`
- [ ] Implement login endpoint `/auth/login` with JWT issuance
- [ ] Add password hashing and reset flow (bcrypt + reset token)
- [ ] Add basic user model and migrations (users table)
- [ ] Implement role model and seed initial roles (Employee, Manager, Admin)
- [ ] Implement middleware/guards to validate JWT and roles
- [ ] Add `/auth/profile` endpoint and user CRUD skeleton
- [ ] Add environment variables guidance in `docs/dev/notes.md`

## Acceptance Criteria

- Users can register and log in locally
- JWT tokens are returned and validated by guards
- Initial role-based access enforcement exists for admin-only routes
