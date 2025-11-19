require('dotenv').config();
const mysql = require('mysql2/promise');

async function test() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  });

  const [rows] = await pool.query('SELECT 1 + 1 AS result');
  console.log('DB connection works:', rows);
  await pool.end();
}

test();
