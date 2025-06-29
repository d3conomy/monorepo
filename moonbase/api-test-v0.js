#!/usr/bin/env node

/**
 * Moonbase API Test Suite - Updated for v0 API routes
 */

import http from 'http';
import { URL } from 'url';

const BASE_URL = 'http://localhost:4343';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function makeRequest(method, url, data = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    };
    
    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }
    
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        let parsedData;
        try {
          parsedData = JSON.parse(responseData);
        } catch (e) {
          parsedData = responseData;
        }
        
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          data: parsedData
        });
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testEndpoint(method, path, data = null, description = '') {
  const url = `${BASE_URL}${path}`;
  
  try {
    log(`\n🧪 Testing: ${description || `${method} ${path}`}`, colors.blue);
    
    const response = await makeRequest(method, url, data);
    const { status, statusText, data: responseData } = response;
    
    if (status >= 200 && status < 300) {
      log(`✅ SUCCESS: ${status} ${statusText}`, colors.green);
    } else if (status === 404) {
      log(`❌ NOT FOUND: ${status} - Route not implemented`, colors.red);
    } else {
      log(`⚠️  STATUS: ${status} ${statusText}`, colors.yellow);
    }
    
    // Show response preview
    if (typeof responseData === 'object') {
      const preview = JSON.stringify(responseData, null, 2);
      log(`📄 Response: ${preview.substring(0, 300)}${preview.length > 300 ? '...' : ''}`);
    } else {
      log(`📄 Response: ${responseData.toString().substring(0, 200)}${responseData.toString().length > 200 ? '...' : ''}`);
    }
    
    return { success: status >= 200 && status < 300, status, data: responseData };
    
  } catch (error) {
    log(`❌ ERROR: ${error.message}`, colors.red);
    return { success: false, error: error.message };
  }
}

async function runAPITests() {
  log(`${colors.bold}🚀 Moonbase API Test Suite - v0 Routes${colors.reset}`, colors.blue);
  log(`🎯 Testing API at: ${BASE_URL}\n`);
  
  const tests = [];
  
  // Test the documented routes first
  log(`${colors.bold}📚 SWAGGER DOCUMENTATION${colors.reset}`, colors.blue);
  tests.push(await testEndpoint('GET', '/api/v0/docs', null, 'Swagger API Documentation'));
  
  // Test the main API routes that should exist based on the server code
  log(`${colors.bold}🚀 POD BAY ROUTES${colors.reset}`, colors.blue);
  tests.push(await testEndpoint('GET', '/api/v0/pod-bay', null, 'Pod Bay Status'));
  tests.push(await testEndpoint('GET', '/api/v0/pods', null, 'List Pods'));
  
  log(`${colors.bold}📊 METRICS ROUTES${colors.reset}`, colors.blue);
  tests.push(await testEndpoint('GET', '/api/v0/metrics', null, 'System Metrics'));
  
  log(`${colors.bold}🗄️  DATABASE ROUTES${colors.reset}`, colors.blue);
  tests.push(await testEndpoint('GET', '/api/v0/db', null, 'Database Status'));
  tests.push(await testEndpoint('GET', '/api/v0/databases', null, 'List Databases'));
  
  log(`${colors.bold}📡 PUBSUB ROUTES${colors.reset}`, colors.blue);
  tests.push(await testEndpoint('GET', '/api/v0/pubsub', null, 'PubSub Status'));
  
  log(`${colors.bold}📁 FILESYSTEM ROUTES${colors.reset}`, colors.blue);
  tests.push(await testEndpoint('GET', '/api/v0/fs', null, 'Filesystem Status'));
  tests.push(await testEndpoint('GET', '/api/v0/files', null, 'List Files'));
  
  // Test some basic endpoints that might exist
  log(`${colors.bold}🔍 DISCOVERY TESTS${colors.reset}`, colors.blue);
  tests.push(await testEndpoint('GET', '/api/v0/', null, 'API Root'));
  tests.push(await testEndpoint('GET', '/api/v0/status', null, 'API Status'));
  tests.push(await testEndpoint('GET', '/api/v0/health', null, 'Health Check'));
  tests.push(await testEndpoint('GET', '/api/v0/version', null, 'API Version'));
  
  // Test root level
  log(`${colors.bold}🌐 ROOT LEVEL TESTS${colors.reset}`, colors.blue);
  tests.push(await testEndpoint('GET', '/', null, 'Root Path'));
  tests.push(await testEndpoint('GET', '/health', null, 'Root Health'));
  tests.push(await testEndpoint('GET', '/status', null, 'Root Status'));
  
  // Calculate results
  const successful = tests.filter(t => t.success).length;
  const total = tests.length;
  const failed = total - successful;
  const notFound = tests.filter(t => t.status === 404).length;
  
  log(`\n${colors.bold}📊 TEST RESULTS SUMMARY${colors.reset}`);
  log(`✅ Successful: ${successful}/${total}`, successful > 0 ? colors.green : colors.red);
  log(`❌ Failed: ${failed}/${total}`, failed === 0 ? colors.green : colors.red);
  log(`🔍 Not Found (404): ${notFound}/${total}`, colors.yellow);
  log(`📈 Success Rate: ${((successful/total) * 100).toFixed(1)}%`);
  
  if (successful > 0) {
    log(`\n🎉 Found ${successful} working endpoints!`, colors.green);
    log(`💡 The API server is responding - routes may need implementation`, colors.blue);
  } else {
    log(`\n😞 No endpoints responded successfully`, colors.red);
    if (notFound === total) {
      log(`💡 All endpoints returned 404 - API routes need to be implemented`, colors.yellow);
    }
  }
  
  return { successful, total, failed, notFound };
}

runAPITests().catch(error => {
  log(`❌ Test suite failed: ${error.message}`, colors.red);
  process.exit(1);
});
