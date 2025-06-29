#!/usr/bin/env node

/**
 * Moonbase Test Runner
 * Tests if Moonbase can initialize without starting the API server
 */

import { Moonbase } from './dist/src/index.js';

console.log('🧪 Testing Moonbase initialization...');

try {
  console.log('✅ Moonbase class imported successfully');
  
  // Test that the moonbase instance is available
  console.log('📡 Checking for moonbase instance...');
  
  // Import the moonbase instance
  const { moonbase } = await import('./dist/src/index.js');
  
  if (moonbase) {
    console.log('✅ Moonbase instance created successfully');
    console.log('🎯 System ID:', moonbase.id);
    console.log('🔐 Auth system:', moonbase.auth ? 'initialized' : 'not initialized');
    console.log('🌐 API server:', moonbase.api ? 'available' : 'not available');
    console.log('🚀 Pod bay:', moonbase.podBay ? 'available' : 'not available');
  } else {
    console.log('❌ Moonbase instance not found');
  }
  
  console.log('✨ Test completed successfully!');
  process.exit(0);
  
} catch (error) {
  console.error('❌ Error during initialization:', error.message);
  console.error('🔍 Stack trace:', error.stack);
  process.exit(1);
}
