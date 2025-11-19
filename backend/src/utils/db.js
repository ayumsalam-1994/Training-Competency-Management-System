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

module.exports = {
  pool,
  createUser,
  getUserByEmail,
  getUserById,
  getAllRoles,
  getRoleById,
  createRole,
  initializeDatabase,
};

