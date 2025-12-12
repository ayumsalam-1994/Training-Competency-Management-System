/**
 * Database Migration: Create Competency & Certificate Tables
 * Run this script to set up competency management tables
 * 
 * Usage: node scripts/createCompetencyTables.js
 */

const { pool } = require('../src/utils/db');

async function createCompetencyTables() {
  const connection = await pool.getConnection();
  
  try {
    console.log('Creating competency and certificate tables...');

    // 1. Create competencies table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS competencies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created competencies table');

    // 2. Create user_competencies table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_competencies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        competency_id INT NOT NULL,
        proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner',
        achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (competency_id) REFERENCES competencies(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_competency (user_id, competency_id)
      )
    `);
    console.log('✓ Created user_competencies table');

    // 3. Create certificates table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        competency_id INT NOT NULL,
        issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NULL,
        pdf_path VARCHAR(500),
        verification_code VARCHAR(100) UNIQUE,
        status ENUM('active', 'expired', 'revoked') DEFAULT 'active',
        issued_by INT,
        revoked_at TIMESTAMP NULL,
        revoked_reason TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (competency_id) REFERENCES competencies(id) ON DELETE CASCADE,
        FOREIGN KEY (issued_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✓ Created certificates table');

    // 4. Create indexes for performance (MySQL doesn't support IF NOT EXISTS for indexes)
    // We'll use a different approach - check if index exists before creating
    const createIndexSafely = async (indexName, tableName, columnName) => {
      try {
        const [indexes] = await connection.query(
          `SHOW INDEX FROM ${tableName} WHERE Key_name = ?`,
          [indexName]
        );
        
        if (indexes.length === 0) {
          await connection.query(
            `CREATE INDEX ${indexName} ON ${tableName}(${columnName})`
          );
          console.log(`✓ Created index: ${indexName}`);
        } else {
          console.log(`⏭️  Index already exists: ${indexName}`);
        }
      } catch (error) {
        console.warn(`⚠️  Could not create index ${indexName}:`, error.message);
      }
    };

    await createIndexSafely('idx_user_competencies_user', 'user_competencies', 'user_id');
    await createIndexSafely('idx_user_competencies_competency', 'user_competencies', 'competency_id');
    await createIndexSafely('idx_certificates_user', 'certificates', 'user_id');
    await createIndexSafely('idx_certificates_competency', 'certificates', 'competency_id');
    await createIndexSafely('idx_certificates_status', 'certificates', 'status');
    await createIndexSafely('idx_certificates_expires', 'certificates', 'expires_at');

    console.log('\n✅ All competency tables created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Run the migration
(async () => {
  try {
    await createCompetencyTables();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
})();
