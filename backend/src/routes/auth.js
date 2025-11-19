const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail, getUserById, getRoleById } = require('../utils/db');
const { authGuard } = require('../middleware/authMiddleware');

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, roleId } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const existing = await getUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = await createUser(email, hash, roleId || 1); // Default role_id = 1 (Employee)

    const role = await getRoleById(user.role_id);
    const token = jwt.sign(
      { id: user.id, email: user.email, roleId: user.role_id, role: role?.name || 'Employee' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.TOKEN_EXPIRY || '1h' }
    );

    res.json({ token, user: { id: user.id, email: user.email, roleId: user.role_id } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const role = await getRoleById(user.role_id);
    const token = jwt.sign(
      { id: user.id, email: user.email, roleId: user.role_id, role: role?.name || 'Employee' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.TOKEN_EXPIRY || '1h' }
    );

    res.json({ token, user: { id: user.id, email: user.email, roleId: user.role_id } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Profile endpoint (protected)
router.get('/profile', authGuard, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const role = await getRoleById(user.role_id);
    res.json({ user: { id: user.id, email: user.email, roleId: user.role_id, role: role?.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
