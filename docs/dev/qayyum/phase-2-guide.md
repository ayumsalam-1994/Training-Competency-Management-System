# Phase 2 Learning Guide: Replacing Mock Data with Real Database Queries

## Overview

In Phase 1, you created a working frontend UI and backend structure with mock data. In Phase 2, you'll learn how to replace that mock data with real MySQL database queries. This is a critical skill for building production-ready applications.

---

## Table of Contents

1. [Understanding the Architecture](#1-understanding-the-architecture)
2. [Creating Database Helper Functions](#2-creating-database-helper-functions)
3. [Updating the Service Layer](#3-updating-the-service-layer)
4. [Testing with Real Data](#4-testing-with-real-data)
5. [Common Patterns and Best Practices](#5-common-patterns-and-best-practices)

---

## 1. Understanding the Architecture

### The Three-Layer Pattern

Our backend follows a common pattern called the "Three-Layer Architecture":

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT REQUEST                               │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  ROUTES (competencyRoutes.js)                                        │
│  - Define URL endpoints                                              │
│  - Map HTTP methods (GET, POST, PUT, DELETE) to controllers          │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  CONTROLLER (competencyController.js)                                │
│  - Handle HTTP requests/responses                                    │
│  - Validate input                                                    │
│  - Call service methods                                              │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  SERVICE (competencyService.js)                                      │
│  - Business logic                                                    │
│  - Data transformation                                               │
│  - Call database helper functions                                    │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  DATABASE HELPERS (db.js)                                            │
│  - Raw SQL queries                                                   │
│  - Connection management                                             │
│  - Return raw database results                                       │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         MySQL DATABASE                               │
└─────────────────────────────────────────────────────────────────────┘
```

### Why This Pattern?

1. **Separation of Concerns**: Each layer has one job
2. **Testability**: You can test each layer independently
3. **Maintainability**: Changes to one layer don't affect others
4. **Reusability**: Database functions can be reused across services

---

## 2. Creating Database Helper Functions

### Step 2.1: Understand the Database Connection

Open `backend/src/utils/db.js` and look at the pool setup:

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tcms',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

**Key Concepts:**
- `mysql2/promise` - We use the promise-based version for async/await
- `pool` - Connection pool manages multiple database connections
- `connectionLimit: 10` - Maximum 10 concurrent connections

### Step 2.2: Write a Basic Query Function

Here's the pattern for writing a database helper function:

```javascript
/**
 * Get all competencies from the database
 * @returns {Promise<Array>} Array of competency objects
 */
async function getAllCompetencies() {
  const connection = await pool.getConnection();
  try {
    const query = 'SELECT * FROM competencies ORDER BY created_at DESC';
    const [rows] = await connection.execute(query);
    return rows;
  } finally {
    connection.release(); // ALWAYS release the connection!
  }
}
```

**Important Points:**
1. Get a connection from the pool
2. Use `try/finally` to ensure connection is released
3. `execute()` returns an array: `[rows, fields]`
4. We destructure to get just the rows: `const [rows] = ...`

### Step 2.3: Write a Query with Parameters

When you need to pass values to a query, use parameterized queries to prevent SQL injection:

```javascript
/**
 * Get a single competency by ID
 * @param {number} id - Competency ID
 * @returns {Promise<Object|null>} Competency object or null
 */
async function getCompetencyById(id) {
  const connection = await pool.getConnection();
  try {
    const query = 'SELECT * FROM competencies WHERE id = ?';
    const [rows] = await connection.execute(query, [id]); // Pass params as array
    return rows[0] || null; // Return first row or null
  } finally {
    connection.release();
  }
}
```

**Key Points:**
- Use `?` as placeholders in the query
- Pass values as an array in the second argument
- Never concatenate user input directly into SQL!

### Step 2.4: Write an INSERT Function

```javascript
/**
 * Create a new competency
 * @param {string} name - Competency name
 * @param {string} description - Description
 * @param {string} level - Level (beginner/intermediate/advanced)
 * @returns {Promise<Object>} Insert result with insertId
 */
async function createCompetency(name, description, level) {
  const connection = await pool.getConnection();
  try {
    const query = `
      INSERT INTO competencies (name, description, level)
      VALUES (?, ?, ?)
    `;
    const [result] = await connection.execute(query, [name, description, level]);
    return { 
      insertId: result.insertId,
      affectedRows: result.affectedRows 
    };
  } finally {
    connection.release();
  }
}
```

**Key Points:**
- INSERT returns a result object with `insertId` and `affectedRows`
- `insertId` is the auto-generated ID of the new row

### Step 2.5: Write a JOIN Query

For getting related data from multiple tables:

```javascript
/**
 * Get all competencies for a user with details
 * @param {number} userId - User ID
 * @returns {Promise<Array>} User competencies with competency details
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
```

**Key Points:**
- Use `AS` to rename columns in the result
- `JOIN` combines data from related tables
- The `ON` clause specifies how tables are related

### Step 2.6: Write an UPSERT Function (Insert or Update)

```javascript
/**
 * Assign a competency to a user (or update if exists)
 * @param {number} userId - User ID
 * @param {number} competencyId - Competency ID
 * @param {string} proficiencyLevel - Proficiency level
 * @param {string} notes - Optional notes
 * @returns {Promise<Object>} Result object
 */
async function assignCompetencyToUser(userId, competencyId, proficiencyLevel, notes) {
  const connection = await pool.getConnection();
  try {
    const query = `
      INSERT INTO user_competencies (user_id, competency_id, proficiency_level, notes, achieved_at)
      VALUES (?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE 
        proficiency_level = VALUES(proficiency_level), 
        notes = VALUES(notes)
    `;
    const [result] = await connection.execute(query, [userId, competencyId, proficiencyLevel, notes]);
    return { 
      id: result.insertId,
      user_id: userId,
      competency_id: competencyId,
      proficiency_level: proficiencyLevel 
    };
  } finally {
    connection.release();
  }
}
```

**Key Points:**
- `ON DUPLICATE KEY UPDATE` handles the case where the record already exists
- `VALUES()` function references the values that would have been inserted
- Useful when you have a unique constraint on the table

### Step 2.7: Export All Functions

At the end of db.js, export your functions:

```javascript
module.exports = {
  pool,
  initializeDatabase,
  // ... other existing functions ...
  
  // Competency functions
  getAllCompetencies,
  getCompetencyById,
  createCompetency,
  getUserCompetencies,
  getUserCertificates,
  assignCompetencyToUser,
  updateUserCompetencyLevel,
  issueCertificate
};
```

---

## 3. Updating the Service Layer

### Step 3.1: Import the Database Helper

At the top of your service file:

```javascript
const db = require('../utils/db');
```

### Step 3.2: Replace Mock Data with Real Queries

**Before (Mock Data):**
```javascript
async getAllCompetencies() {
  // Fake data - not from database
  return [
    { id: 1, name: 'JavaScript', level: 'intermediate' },
    { id: 2, name: 'Python', level: 'beginner' }
  ];
}
```

**After (Real Database):**
```javascript
async getAllCompetencies() {
  try {
    const competencies = await db.getAllCompetencies();
    return competencies;
  } catch (error) {
    console.error('Error fetching competencies:', error);
    throw new Error('Failed to fetch competencies');
  }
}
```

### Step 3.3: Add Error Handling

Always wrap database calls in try/catch:

```javascript
async getCompetencyById(id) {
  try {
    const competency = await db.getCompetencyById(id);
    
    if (!competency) {
      return null; // Let controller handle 404
    }
    
    return competency;
  } catch (error) {
    console.error('Error fetching competency:', error);
    throw new Error('Failed to fetch competency');
  }
}
```

### Step 3.4: Add Business Logic

The service layer is where you add business rules:

```javascript
async assignCompetencyToUser(userId, competencyId, proficiencyLevel = 'beginner', notes = null) {
  try {
    // Business rule: Validate proficiency level
    const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
    if (!validLevels.includes(proficiencyLevel)) {
      proficiencyLevel = 'beginner'; // Default to beginner if invalid
    }
    
    // Call database helper
    const result = await db.assignCompetencyToUser(userId, competencyId, proficiencyLevel, notes);
    
    // Transform response
    return {
      id: result.id,
      user_id: userId,
      competency_id: competencyId,
      proficiency_level: proficiencyLevel,
      notes: notes,
      achieved_at: new Date()
    };
  } catch (error) {
    console.error('Error assigning competency:', error);
    throw new Error('Failed to assign competency');
  }
}
```

### Step 3.5: Aggregate Data for Statistics

Sometimes you need to process data from multiple sources:

```javascript
async getUserCompetencyStats(userId) {
  try {
    // Fetch data from multiple sources in parallel
    const [competencies, certificates] = await Promise.all([
      this.getUserCompetencies(userId),
      this.getUserCertificates(userId)
    ]);

    // Calculate statistics
    const totalCompetencies = competencies.length;
    const masteredCompetencies = competencies.filter(c => 
      c.proficiency_level === 'expert' || c.proficiency_level === 'advanced'
    ).length;
    
    // Calculate average progress score
    const levelScores = { beginner: 25, intermediate: 50, advanced: 75, expert: 100 };
    const totalScore = competencies.reduce((sum, c) => 
      sum + (levelScores[c.proficiency_level] || 0), 0
    );
    const averageProgress = totalCompetencies > 0 
      ? Math.round(totalScore / totalCompetencies) 
      : 0;

    return {
      totalCompetencies,
      masteredCompetencies,
      inProgressCompetencies: totalCompetencies - masteredCompetencies,
      totalCertificates: certificates.length,
      averageProgress
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw new Error('Failed to fetch statistics');
  }
}
```

**Key Points:**
- `Promise.all()` runs multiple async operations in parallel
- Use `reduce()` for calculating totals
- Use `filter()` for counting items that match criteria

---

## 4. Testing with Real Data

### Step 4.1: Test with Postman or curl

First, get a JWT token by logging in:

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@tcms.com","password":"test123"}'
```

Response:
```json
{
  "token": "eyJhbGc...",
  "user": {"id": 1, "email": "test@tcms.com"}
}
```

### Step 4.2: Test GET All Competencies

```bash
curl http://localhost:4000/competencies \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Step 4.3: Test POST Assign Competency

```bash
curl -X POST http://localhost:4000/competencies/assign \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"competencyId": 1, "proficiencyLevel": "intermediate"}'
```

### Step 4.4: Test GET User Competencies

```bash
curl http://localhost:4000/competencies/user/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Step 4.5: Verify in Database

You can also verify directly in MySQL:

```sql
-- Check all competencies
SELECT * FROM competencies;

-- Check user's assigned competencies
SELECT uc.*, c.name 
FROM user_competencies uc 
JOIN competencies c ON uc.competency_id = c.id 
WHERE uc.user_id = 1;
```

---

## 5. Common Patterns and Best Practices

### Pattern 1: Always Use Parameterized Queries

**NEVER do this (SQL Injection vulnerability!):**
```javascript
// DANGEROUS - Don't do this!
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

**ALWAYS do this:**
```javascript
// Safe - Use parameterized queries
const query = 'SELECT * FROM users WHERE email = ?';
const [rows] = await connection.execute(query, [email]);
```

### Pattern 2: Always Release Connections

```javascript
async function queryDatabase() {
  const connection = await pool.getConnection();
  try {
    // Do your work
    const [rows] = await connection.execute(query);
    return rows;
  } finally {
    // Always release, even if there's an error
    connection.release();
  }
}
```

### Pattern 3: Use Transactions for Multiple Related Operations

```javascript
async function transferBetweenAccounts(fromId, toId, amount) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Debit from source
    await connection.execute(
      'UPDATE accounts SET balance = balance - ? WHERE id = ?',
      [amount, fromId]
    );
    
    // Credit to destination
    await connection.execute(
      'UPDATE accounts SET balance = balance + ? WHERE id = ?',
      [amount, toId]
    );
    
    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
```

### Pattern 4: Handle NULL Values

```javascript
async function createRecord(name, description = null) {
  const query = 'INSERT INTO items (name, description) VALUES (?, ?)';
  // NULL values are passed directly - mysql2 handles them
  const [result] = await connection.execute(query, [name, description]);
  return result;
}
```

### Pattern 5: Use ENUM Validation

```javascript
const VALID_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];

function validateLevel(level) {
  if (!VALID_LEVELS.includes(level)) {
    throw new Error(`Invalid level. Must be one of: ${VALID_LEVELS.join(', ')}`);
  }
  return level;
}
```

---

## Summary: What You Learned

1. **Database Connection Pooling** - How to efficiently manage database connections
2. **CRUD Operations** - Create, Read, Update, Delete patterns
3. **Parameterized Queries** - Preventing SQL injection
4. **JOIN Queries** - Combining data from multiple tables
5. **Error Handling** - Proper try/catch patterns
6. **Service Layer** - Adding business logic between controller and database
7. **Testing** - How to verify your API endpoints work correctly

---

## Practice Exercise

Try implementing these on your own:

1. Create a `deleteCompetency(id)` function in db.js
2. Create a `searchCompetencies(searchTerm)` function that uses `LIKE`
3. Add a `removeUserCompetency(userId, competencyId)` function
4. Create a service method that checks if a user has a specific competency

---

## Next Steps

In Phase 3, you'll learn:
- Certificate PDF generation
- File uploads and storage
- Email notifications
- Role-based authorization (Admin vs Employee)

Keep practicing! The more you work with databases, the more natural it becomes.
