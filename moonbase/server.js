#!/usr/bin/env node

/**
 * Moonbase Server Entry Point
 * This file serves as the main executable for running Moonbase
 */

import { moonbase } from './dist/src/index.js';

console.log('🚀 Starting Moonbase...');
console.log('📡 Moonbase is running on port 4343');
console.log('🔗 API available at http://localhost:4343');
console.log('✨ System ready!');

// Handle port conflicts
process.on('uncaughtException', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log('⚠️  Port 4343 is already in use!');
    console.log('💡 Try stopping other services or use a different port');
    console.log('🔍 Check what\'s using the port: lsof -ti:4343');
    process.exit(1);
  } else {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
});

// Keep the process alive
process.on('SIGTERM', () => {
  console.log('👋 Shutting down Moonbase...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 Shutting down Moonbase...');
  process.exit(0);
});
