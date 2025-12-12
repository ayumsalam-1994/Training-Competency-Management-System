/**
 * Seed Competencies
 * Adds sample competency data for testing
 * 
 * Usage: node scripts/seedCompetencies.js
 */

const { pool } = require('../src/utils/db');

const sampleCompetencies = [
  {
    name: 'Basic Safety Training',
    description: 'Fundamental workplace safety protocols and procedures including emergency response, hazard identification, and personal protective equipment usage.',
    level: 'beginner'
  },
  {
    name: 'Advanced Technical Skills',
    description: 'Advanced programming, system administration, and technical troubleshooting capabilities for complex enterprise systems.',
    level: 'advanced'
  },
  {
    name: 'Leadership Fundamentals',
    description: 'Basic leadership principles including team management, communication, delegation, and conflict resolution.',
    level: 'intermediate'
  },
  {
    name: 'Data Analysis',
    description: 'Data visualization, statistical analysis, and insights generation using modern analytics tools and methodologies.',
    level: 'intermediate'
  },
  {
    name: 'Project Management',
    description: 'Agile methodologies, project planning, risk management, and stakeholder communication for successful project delivery.',
    level: 'advanced'
  },
  {
    name: 'Customer Service Excellence',
    description: 'Customer interaction best practices, complaint handling, and building positive customer relationships.',
    level: 'beginner'
  },
  {
    name: 'Cybersecurity Fundamentals',
    description: 'Information security basics, threat awareness, data protection, and secure computing practices.',
    level: 'intermediate'
  }
];

async function seedCompetencies() {
  const connection = await pool.getConnection();
  
  try {
    console.log('Seeding competencies...\n');

    for (const competency of sampleCompetencies) {
      // Check if competency already exists
      const [existing] = await connection.query(
        'SELECT id FROM competencies WHERE name = ?',
        [competency.name]
      );

      if (existing.length > 0) {
        console.log(`⏭️  Skipped: "${competency.name}" (already exists)`);
      } else {
        await connection.query(
          'INSERT INTO competencies (name, description, level) VALUES (?, ?, ?)',
          [competency.name, competency.description, competency.level]
        );
        console.log(`✓ Added: "${competency.name}" [${competency.level}]`);
      }
    }

    console.log('\n✅ Competency seeding completed!');
    
    // Show final count
    const [count] = await connection.query('SELECT COUNT(*) as total FROM competencies');
    console.log(`📊 Total competencies in database: ${count[0].total}`);
    
  } catch (error) {
    console.error('❌ Error seeding competencies:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Run the seed
(async () => {
  try {
    await seedCompetencies();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    await pool.end();
    process.exit(1);
  }
})();
