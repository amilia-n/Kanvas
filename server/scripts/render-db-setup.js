#!/usr/bin/env node
/**
 * Database setup script for Render deployment
 * This runs during the build phase to initialize the database schema and seed data
 */
import init from '../src/db/init.js';

console.log('🚀 Starting database setup for Render...');

init()
  .then(() => {
    console.log('✅ Database setup completed successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Database setup failed:', err);
    // Don't fail the build if database already exists (tables might already be created)
    if (err.code === '42P07') {
      console.log('⚠️  Tables already exist, skipping initialization');
      process.exit(0);
    }
    process.exit(1);
  });

