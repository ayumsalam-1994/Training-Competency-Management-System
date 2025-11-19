const { pool, createRole, getAllRoles, initializeDatabase } = require('../src/utils/db');

async function seed() {
  try {
    // Initialize database tables
    await initializeDatabase();

    // Check existing roles
    const existing = await getAllRoles();
    const roleNames = existing.map(r => r.name);

    // Seed roles if not already present
    const roles = ['Employee', 'Manager', 'Admin'];
    for (const role of roles) {
      if (!roleNames.includes(role)) {
        await createRole(role);
        console.log(`Created role: ${role}`);
      } else {
        console.log(`Role already exists: ${role}`);
      }
    }

    const allRoles = await getAllRoles();
    console.log('All roles in database:', allRoles);

    // Close the pool
    await pool.end();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
