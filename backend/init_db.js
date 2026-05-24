const pool = require('./src/config/db');
const fs = require('fs');
const path = require('path');

const runSchema = async () => {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Connecting to Neon PostgreSQL database...');
    // Test connection
    const res = await pool.query('SELECT NOW()');
    console.log('Database connected successfully at', res.rows[0].now);

    console.log('Checking if tables already exist...');
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('organizations', 'users', 'tasks', 'activity_logs', 'invites')
    `);
    
    if (tableCheck.rows.length > 0) {
      console.log('Some or all tables already exist:', tableCheck.rows.map(r => r.table_name).join(', '));
      console.log('Skipping schema initialization to prevent data loss.');
    } else {
      console.log('Initializing schema...');
      await pool.query(schemaSql);
      console.log('Schema initialized successfully!');
    }
  } catch (error) {
    console.error('Error during database initialization:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runSchema();
