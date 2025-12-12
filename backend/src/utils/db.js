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
  authPlugins: {
    mysql_native_password: () => () => process.env.DB_PASSWORD,
  },
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

// Quiz table operations
async function createQuiz(title, description, duration = null, passing_score = 60, difficulty = 'medium', created_by = null) {
  const connection = await pool.getConnection();
  try {
    const query = 'INSERT INTO quizzes (title, description, duration, passing_score, difficulty, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())';
    const [result] = await connection.execute(query, [title, description, duration, passing_score, difficulty, created_by]);
    return { id: result.insertId, title, description, duration, passing_score, difficulty, created_by };
  } finally {
    connection.release();
  }
}

async function getQuizById(id) {
  const connection = await pool.getConnection();
  try {
    const query = 'SELECT * FROM quizzes WHERE id = ?';
    const [rows] = await connection.execute(query, [id]);
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

async function getAllQuizzes() {
  const connection = await pool.getConnection();
  try {
    const query = 'SELECT id, title, description, duration, passing_score, difficulty, created_at FROM quizzes ORDER BY created_at DESC';
    const [rows] = await connection.execute(query);
    return rows;
  } finally {
    connection.release();
  }
}

async function createQuestion(quiz_id, question_text, question_type, correct_answer, explanation = null, time_limit = null) {
  const connection = await pool.getConnection();
  try {
    const query = 'INSERT INTO questions (quiz_id, question_text, question_type, correct_answer, explanation, time_limit, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())';
    const [result] = await connection.execute(query, [quiz_id, question_text, question_type, correct_answer, explanation, time_limit]);
    return { id: result.insertId, quiz_id, question_text, question_type, correct_answer, explanation, time_limit };
  } finally {
    connection.release();
  }
}

async function getQuestionsByQuizId(quiz_id) {
  const connection = await pool.getConnection();
  try {
    const query = 'SELECT id, quiz_id, question_text, question_type, explanation, time_limit FROM questions WHERE quiz_id = ? ORDER BY id ASC';
    const [rows] = await connection.execute(query, [quiz_id]);
    return rows;
  } finally {
    connection.release();
  }
}

async function getQuestionsByQuizIdWithAnswers(quiz_id) {
  const connection = await pool.getConnection();
  try {
    const query = 'SELECT id, quiz_id, question_text, question_type, correct_answer, explanation, time_limit FROM questions WHERE quiz_id = ? ORDER BY id ASC';
    const [rows] = await connection.execute(query, [quiz_id]);
    return rows;
  } finally {
    connection.release();
  }
}

async function createQuizOption(question_id, option_text, is_correct = false) {
  const connection = await pool.getConnection();
  try {
    const query = 'INSERT INTO quiz_options (question_id, option_text, is_correct) VALUES (?, ?, ?)';
    const [result] = await connection.execute(query, [question_id, option_text, is_correct]);
    return { id: result.insertId, question_id, option_text, is_correct };
  } finally {
    connection.release();
  }
}

async function getOptionsByQuestionId(question_id) {
  const connection = await pool.getConnection();
  try {
    const query = 'SELECT id, question_id, option_text, is_correct FROM quiz_options WHERE question_id = ?';
    const [rows] = await connection.execute(query, [question_id]);
    return rows;
  } finally {
    connection.release();
  }
}

async function createQuizAttempt(user_id, quiz_id) {
  const connection = await pool.getConnection();
  try {
    const query = 'INSERT INTO quiz_attempts (user_id, quiz_id, started_at, status) VALUES (?, ?, NOW(), "in_progress")';
    const [result] = await connection.execute(query, [user_id, quiz_id]);
    return { id: result.insertId, user_id, quiz_id };
  } finally {
    connection.release();
  }
}

async function submitQuizAnswer(attempt_id, question_id, user_answer, is_correct) {
  const connection = await pool.getConnection();
  try {
    const query = 'INSERT INTO quiz_answers (attempt_id, question_id, user_answer, is_correct, answered_at) VALUES (?, ?, ?, ?, NOW())';
    const [result] = await connection.execute(query, [attempt_id, question_id, user_answer, is_correct]);
    return { id: result.insertId, attempt_id, question_id, user_answer, is_correct };
  } finally {
    connection.release();
  }
}

async function completeQuizAttempt(attempt_id, score, percentage) {
  const connection = await pool.getConnection();
  try {
    const query = 'UPDATE quiz_attempts SET status = "completed", completed_at = NOW(), score = ?, percentage = ? WHERE id = ?';
    await connection.execute(query, [score, percentage, attempt_id]);
    return { id: attempt_id, score, percentage, status: 'completed' };
  } finally {
    connection.release();
  }
}

async function getQuizAttemptById(attempt_id) {
  const connection = await pool.getConnection();
  try {
    const query = 'SELECT * FROM quiz_attempts WHERE id = ?';
    const [rows] = await connection.execute(query, [attempt_id]);
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

async function getQuizAttemptAnswers(attempt_id) {
  const connection = await pool.getConnection();
  try {
    const query = 'SELECT * FROM quiz_answers WHERE attempt_id = ?';
    const [rows] = await connection.execute(query, [attempt_id]);
    return rows;
  } finally {
    connection.release();
  }
}

async function getUserQuizAttempts(user_id, quiz_id = null) {
  const connection = await pool.getConnection();
  try {
    let query = 'SELECT id, user_id, quiz_id, started_at, completed_at, score, percentage, status FROM quiz_attempts WHERE user_id = ?';
    const params = [user_id];
    if (quiz_id) {
      query += ' AND quiz_id = ?';
      params.push(quiz_id);
    }
    query += ' ORDER BY started_at DESC';
    const [rows] = await connection.execute(query, params);
    return rows;
  } finally {
    connection.release();
  }
}

// Admin functions for quiz management
async function updateQuiz(quiz_id, title, description, duration, passing_score, difficulty) {
  const connection = await pool.getConnection();
  try {
    const query = 'UPDATE quizzes SET title = ?, description = ?, duration = ?, passing_score = ?, difficulty = ? WHERE id = ?';
    const [result] = await connection.execute(query, [title, description, duration, passing_score, difficulty, quiz_id]);
    return { id: quiz_id, title, description, duration, passing_score, difficulty };
  } finally {
    connection.release();
  }
}

async function deleteQuiz(quiz_id) {
  const connection = await pool.getConnection();
  try {
    const query = 'DELETE FROM quizzes WHERE id = ?';
    await connection.execute(query, [quiz_id]);
    return { success: true, id: quiz_id };
  } finally {
    connection.release();
  }
}

async function updateQuestion(question_id, question_text, question_type, correct_answer, explanation, time_limit) {
  const connection = await pool.getConnection();
  try {
    const query = 'UPDATE questions SET question_text = ?, question_type = ?, correct_answer = ?, explanation = ?, time_limit = ? WHERE id = ?';
    const [result] = await connection.execute(query, [question_text, question_type, correct_answer, explanation, time_limit, question_id]);
    return { id: question_id, question_text, question_type, correct_answer, explanation, time_limit };
  } finally {
    connection.release();
  }
}

async function deleteQuestion(question_id) {
  const connection = await pool.getConnection();
  try {
    const query = 'DELETE FROM questions WHERE id = ?';
    await connection.execute(query, [question_id]);
    return { success: true, id: question_id };
  } finally {
    connection.release();
  }
}

async function updateQuizOption(option_id, option_text, is_correct) {
  const connection = await pool.getConnection();
  try {
    const query = 'UPDATE quiz_options SET option_text = ?, is_correct = ? WHERE id = ?';
    const [result] = await connection.execute(query, [option_text, is_correct, option_id]);
    return { id: option_id, option_text, is_correct };
  } finally {
    connection.release();
  }
}

async function deleteQuizOption(option_id) {
  const connection = await pool.getConnection();
  try {
    const query = 'DELETE FROM quiz_options WHERE id = ?';
    await connection.execute(query, [option_id]);
    return { success: true, id: option_id };
  } finally {
    connection.release();
  }
}

async function getQuestionById(question_id) {
  const connection = await pool.getConnection();
  try {
    const query = 'SELECT * FROM questions WHERE id = ?';
    const [rows] = await connection.execute(query, [question_id]);
    return rows[0] || null;
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

    // Create quizzes table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        duration INT,
        passing_score INT DEFAULT 60,
        difficulty VARCHAR(50) DEFAULT 'medium',
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create questions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS questions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        quiz_id INT NOT NULL,
        question_text TEXT NOT NULL,
        question_type ENUM('mcq', 'true_false', 'short_answer') NOT NULL,
        correct_answer VARCHAR(500),
        explanation TEXT,
        time_limit INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
        INDEX idx_quiz_id (quiz_id)
      )
    `);

    // Create quiz_options table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS quiz_options (
        id INT PRIMARY KEY AUTO_INCREMENT,
        question_id INT NOT NULL,
        option_text VARCHAR(500) NOT NULL,
        is_correct BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
        INDEX idx_question_id (question_id)
      )
    `);

    // Create quiz_attempts table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        quiz_id INT NOT NULL,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        score INT,
        percentage DECIMAL(5, 2),
        status ENUM('in_progress', 'completed', 'abandoned') DEFAULT 'in_progress',
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
        INDEX idx_user_quiz (user_id, quiz_id),
        INDEX idx_status (status)
      )
    `);

    // Create quiz_answers table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS quiz_answers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        attempt_id INT NOT NULL,
        question_id INT NOT NULL,
        user_answer VARCHAR(500),
        is_correct BOOLEAN DEFAULT FALSE,
        answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
        FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
        INDEX idx_attempt_id (attempt_id)
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
  createQuiz,
  getQuizById,
  getAllQuizzes,
  createQuestion,
  getQuestionsByQuizId,
  getQuestionsByQuizIdWithAnswers,
  createQuizOption,
  getOptionsByQuestionId,
  createQuizAttempt,
  submitQuizAnswer,
  completeQuizAttempt,
  getQuizAttemptById,
  getQuizAttemptAnswers,
  getUserQuizAttempts,
  updateQuiz,
  deleteQuiz,
  updateQuestion,
  deleteQuestion,
  getQuestionById,
  updateQuizOption,
  deleteQuizOption,
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

