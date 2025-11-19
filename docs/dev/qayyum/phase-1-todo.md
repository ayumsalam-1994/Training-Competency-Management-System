# Qayyum — Phase 1 (Stage 1) TODO

**Owner**: Qayyum (Member A) — Authentication & User Management

**Stage**: Project Foundation (Week 1)

## Checklist

- [x] Initialize auth service and controller  
	- ✅ Implemented minimal Express auth module in `backend/src/routes/auth.js` and `backend/src/middleware/authMiddleware.js`.
- [x] Implement registration endpoint `/auth/register`  
	- ✅ Registers user in simple JSON DB and returns a JWT. See `backend/src/routes/auth.js`.
- [x] Implement login endpoint `/auth/login` with JWT issuance  
	- ✅ Login implemented; issues JWT with role claims.
- [x] Add password hashing and reset flow (bcrypt + reset token)
	- ✅ Password hashing implemented with bcrypt. Password reset not implemented yet.
- [ ] Add basic user model and migrations (users table)
- [x] Implement role model and seed initial roles (Employee, Manager, Admin)
	- ✅ Roles are seeded by `backend/scripts/seedRoles.js` into the JSON DB.
- [x] Implement middleware/guards to validate JWT and roles
	- ✅ `authGuard` implemented at `backend/src/middleware/authMiddleware.js`; `GET /auth/profile` uses it.
- [x] Add `/auth/profile` endpoint and user CRUD skeleton
	- ✅ `/auth/profile` implemented; user retrieval returns id/email/role.
- [ ] Add environment variables guidance in `docs/dev/notes.md`

## Acceptance Criteria

- Users can register and log in locally
- JWT tokens are returned and validated by guards
- Initial role-based access enforcement exists for admin-only routes
