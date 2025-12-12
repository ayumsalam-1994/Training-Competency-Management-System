require('dotenv').config();
const mysql = require('mysql2/promise');

//create pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// User table operations
async function createUser(email, passwordHash, roleId = 1) {
  const connection = await pool.getConnection();
  try {
    const query = 'INSERT INTO users (email, password_hash, role_id, created_at) VALUES (?, ?, ?, NOW())';
    const [result] = await connection.execute(query, [email, passwordHash, roleId]);
    return { id: result.insertId, email, role_id: roleId };
  } finally {
    connection.release();
  }
}

async function getUserByEmail(email) {
  const connection = await pool.getConnection();
  try {
    const query = 'SELECT id, email, password_hash, role_id FROM users WHERE email = ?';
    const [rows] = await connection.execute(query, [email]);
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

async function getUserById(id) {
  const connection = await pool.getConnection();
  try {
    const query = 'SELECT id, email, role_id FROM users WHERE id = ?';
    const [rows] = await connection.execute(query, [id]);
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

// Role table operations
async function getAllRoles() {
  const connection = await pool.getConnection();
  try {
    const query = 'SELECT id, name FROM roles';
    const [rows] = await connection.execute(query);
    return rows;
  } finally {
    connection.release();
  }
}

async function getRoleById(id) {
  const connection = await pool.getConnection();
  try {
    const query = 'SELECT id, name FROM roles WHERE id = ?';
    const [rows] = await connection.execute(query, [id]);
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

async function createRole(name) {
  const connection = await pool.getConnection();
  try {
    const query = 'INSERT INTO roles (name) VALUES (?)';
    const [result] = await connection.execute(query, [name]);
    return { id: result.insertId, name };
  } finally {
    connection.release();
  }
}

async function initializeDatabase() {
  const connection = await pool.getConnection();
  try {
    // Create roles table if not exists
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create users table if not exists
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id)
      )
    `);

    console.log('Database tables initialized successfully.');
  } finally {
    connection.release();
  }
}

// ============================================
// COMPETENCY TABLE OPERATIONS
// ============================================

/**
 * Get all competencies from the database
 * @returns {Array} List of all competencies
 */
async function getAllCompetencies() {
  const connection = await pool.getConnection();
  try {
    const query = 'SELECT id, name, description, level, created_at, updated_at FROM competencies ORDER BY created_at DESC';
    const [rows] = await connection.execute(query);
    return rows;
  } finally {
    connection.release();
  }
}

/**
 * Get a specific competency by ID
 * @param {number} id - Competency ID
 * @returns {Object|null} Competency object or null
 */
async function getCompetencyById(id) {
  const connection = await pool.getConnection();
  try {
    const query = 'SELECT id, name, description, level, created_at, updated_at FROM competencies WHERE id = ?';
    const [rows] = await connection.execute(query, [id]);
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

/**
 * Create a new competency
 * @param {string} name - Competency name
 * @param {string} description - Competency description
 * @param {string} level - Difficulty level (beginner/intermediate/advanced)
 * @returns {Object} Created competency
 */
async function createCompetency(name, description, level = 'beginner') {
  const connection = await pool.getConnection();
  try {
    const query = 'INSERT INTO competencies (name, description, level) VALUES (?, ?, ?)';
    const [result] = await connection.execute(query, [name, description, level]);
    return { id: result.insertId, name, description, level };
  } finally {
    connection.release();
  }
}

/**
 * Update an existing competency
 * @param {number} id - Competency ID
 * @param {Object} data - Fields to update
 * @returns {boolean} Success status
 */
async function updateCompetency(id, { name, description, level }) {
  const connection = await pool.getConnection();
  try {
    const query = 'UPDATE competencies SET name = ?, description = ?, level = ? WHERE id = ?';
    const [result] = await connection.execute(query, [name, description, level, id]);
    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
}

/**
 * Delete a competency
 * @param {number} id - Competency ID
 * @returns {boolean} Success status
 */
async function deleteCompetency(id) {
  const connection = await pool.getConnection();
  try {
    const query = 'DELETE FROM competencies WHERE id = ?';
    const [result] = await connection.execute(query, [id]);
    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
}

// ============================================
// USER COMPETENCY TABLE OPERATIONS
// ============================================

/**
 * Get all competencies achieved by a user
 * @param {number} userId - User ID
 * @returns {Array} List of user competencies with details
 */
async function getUserCompetencies(userId) {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT 
        uc.id,
        uc.user_id,
        uc.competency_id,
        c.name as competency_name,
        c.description as competency_description,
        c.level as competency_level,
        uc.proficiency_level,
        uc.achieved_at,
        uc.notes
      FROM user_competencies uc
      JOIN competencies c ON uc.competency_id = c.id
      WHERE uc.user_id = ?
      ORDER BY uc.achieved_at DESC
    `;
    const [rows] = await connection.execute(query, [userId]);
    return rows;
  } finally {
    connection.release();
  }
}

/**
 * Assign a competency to a user
 * @param {number} userId - User ID
 * @param {number} competencyId - Competency ID
 * @param {string} proficiencyLevel - User's proficiency level
 * @param {string} notes - Optional notes
 * @returns {Object} Created user competency record
 */
async function assignCompetencyToUser(userId, competencyId, proficiencyLevel = 'beginner', notes = null) {
  const connection = await pool.getConnection();
  try {
    const query = `
      INSERT INTO user_competencies (user_id, competency_id, proficiency_level, notes, achieved_at)
      VALUES (?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE proficiency_level = VALUES(proficiency_level), notes = VALUES(notes)
    `;
    const [result] = await connection.execute(query, [userId, competencyId, proficiencyLevel, notes]);
    return { id: result.insertId, user_id: userId, competency_id: competencyId, proficiency_level: proficiencyLevel };
  } finally {
    connection.release();
  }
}

/**
 * Update user's proficiency level for a competency
 * @param {number} userId - User ID
 * @param {number} competencyId - Competency ID
 * @param {string} proficiencyLevel - New proficiency level
 * @returns {boolean} Success status
 */
async function updateUserCompetencyLevel(userId, competencyId, proficiencyLevel) {
  const connection = await pool.getConnection();
  try {
    const query = 'UPDATE user_competencies SET proficiency_level = ? WHERE user_id = ? AND competency_id = ?';
    const [result] = await connection.execute(query, [proficiencyLevel, userId, competencyId]);
    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
}

/**
 * Remove a competency from a user
 * @param {number} userId - User ID
 * @param {number} competencyId - Competency ID
 * @returns {boolean} Success status
 */
async function removeUserCompetency(userId, competencyId) {
  const connection = await pool.getConnection();
  try {
    const query = 'DELETE FROM user_competencies WHERE user_id = ? AND competency_id = ?';
    const [result] = await connection.execute(query, [userId, competencyId]);
    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
}

// ============================================
// CERTIFICATE TABLE OPERATIONS
// ============================================

/**
 * Get all certificates for a user
 * @param {number} userId - User ID
 * @returns {Array} List of certificates with competency details
 */
async function getUserCertificates(userId) {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT 
        cert.id,
        cert.user_id,
        cert.competency_id,
        c.name as competency_name,
        cert.issued_at,
        cert.expires_at,
        cert.status,
        cert.verification_code,
        cert.pdf_path
      FROM certificates cert
      JOIN competencies c ON cert.competency_id = c.id
      WHERE cert.user_id = ?
      ORDER BY cert.issued_at DESC
    `;
    const [rows] = await connection.execute(query, [userId]);
    return rows;
  } finally {
    connection.release();
  }
}

/**
 * Issue a certificate to a user
 * @param {number} userId - User ID
 * @param {number} competencyId - Competency ID
 * @param {number} issuedBy - Admin user ID who issued the certificate
 * @param {Date} expiresAt - Expiry date (optional)
 * @returns {Object} Created certificate
 */
async function issueCertificate(userId, competencyId, issuedBy, expiresAt = null) {
  const connection = await pool.getConnection();
  try {
    // Generate unique verification code
    const verificationCode = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const query = `
      INSERT INTO certificates (user_id, competency_id, issued_by, expires_at, verification_code, status)
      VALUES (?, ?, ?, ?, ?, 'active')
    `;
    const [result] = await connection.execute(query, [userId, competencyId, issuedBy, expiresAt, verificationCode]);
    
    return { 
      id: result.insertId, 
      user_id: userId, 
      competency_id: competencyId, 
      verification_code: verificationCode,
      status: 'active'
    };
  } finally {
    connection.release();
  }
}

/**
 * Get a certificate by verification code (for validation)
 * @param {string} verificationCode - Unique verification code
 * @returns {Object|null} Certificate details or null
 */
async function getCertificateByVerificationCode(verificationCode) {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT 
        cert.*,
        c.name as competency_name,
        u.email as user_email
      FROM certificates cert
      JOIN competencies c ON cert.competency_id = c.id
      JOIN users u ON cert.user_id = u.id
      WHERE cert.verification_code = ?
    `;
    const [rows] = await connection.execute(query, [verificationCode]);
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

/**
 * Update certificate status
 * @param {number} id - Certificate ID
 * @param {string} status - New status (active/expired/revoked)
 * @param {string} revokedReason - Reason for revocation (if applicable)
 * @returns {boolean} Success status
 */
async function updateCertificateStatus(id, status, revokedReason = null) {
  const connection = await pool.getConnection();
  try {
    let query, params;
    if (status === 'revoked') {
      query = 'UPDATE certificates SET status = ?, revoked_at = NOW(), revoked_reason = ? WHERE id = ?';
      params = [status, revokedReason, id];
    } else {
      query = 'UPDATE certificates SET status = ? WHERE id = ?';
      params = [status, id];
    }
    const [result] = await connection.execute(query, params);
    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
}

/**
 * Get expiring certificates (within specified days)
 * @param {number} daysUntilExpiry - Number of days to check
 * @returns {Array} List of expiring certificates
 */
async function getExpiringCertificates(daysUntilExpiry = 30) {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT 
        cert.*,
        c.name as competency_name,
        u.email as user_email
      FROM certificates cert
      JOIN competencies c ON cert.competency_id = c.id
      JOIN users u ON cert.user_id = u.id
      WHERE cert.status = 'active' 
        AND cert.expires_at IS NOT NULL
        AND cert.expires_at <= DATE_ADD(NOW(), INTERVAL ? DAY)
        AND cert.expires_at > NOW()
      ORDER BY cert.expires_at ASC
    `;
    const [rows] = await connection.execute(query, [daysUntilExpiry]);
    return rows;
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  // User operations
  createUser,
  getUserByEmail,
  getUserById,
  // Role operations
  getAllRoles,
  getRoleById,
  createRole,
  initializeDatabase,
  // Competency operations
  getAllCompetencies,
  getCompetencyById,
  createCompetency,
  updateCompetency,
  deleteCompetency,
  // User competency operations
  getUserCompetencies,
  assignCompetencyToUser,
  updateUserCompetencyLevel,
  removeUserCompetency,
  // Certificate operations
  getUserCertificates,
  issueCertificate,
  getCertificateByVerificationCode,
  updateCertificateStatus,
  getExpiringCertificates,
};

