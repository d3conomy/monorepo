#!/usr/bin/env node

/**
 * Moonbase API Test Suite
 * Comprehensive testing of all Moonbase API endpoints using built-in Node.js modules
 */

import http from 'http';
import https from 'https';
import { URL } from 'url';

const BASE_URL = 'http://localhost:4343';
const TIMEOUT = 10000; // 10 seconds

// Colors for console output
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
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: TIMEOUT
    };
    
    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }
    
    const req = client.request(options, (res) => {
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
          headers: res.headers,
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

async function testEndpoint(method, path, data = null, expectedStatus = 200) {
  const url = `${BASE_URL}${path}`;
  
  try {
    log(`\n🧪 Testing ${method} ${path}`, colors.blue);
    
    const response = await makeRequest(method, url, data);
    const { status, statusText, data: responseData } = response;
    
    if (status === expectedStatus) {
      log(`✅ SUCCESS: ${status} ${statusText}`, colors.green);
    } else {
      log(`⚠️  UNEXPECTED STATUS: ${status} (expected ${expectedStatus})`, colors.yellow);
    }
    
    if (typeof responseData === 'object') {
      log(`📄 Response: ${JSON.stringify(responseData, null, 2).substring(0, 500)}${JSON.stringify(responseData, null, 2).length > 500 ? '...' : ''}`);
    } else {
      log(`📄 Response: ${responseData.substring(0, 200)}${responseData.length > 200 ? '...' : ''}`);
    }
    
    return { success: status === expectedStatus, status, data: responseData };
    
  } catch (error) {
    log(`❌ ERROR: ${error.message}`, colors.red);
    return { success: false, error: error.message };
  }
}

async function runAPITests() {
  log(`${colors.bold}🚀 Moonbase API Test Suite${colors.reset}`, colors.blue);
  log(`🎯 Testing API at: ${BASE_URL}\n`);
  
  const tests = [];
  
  // Basic connectivity tests
  log(`${colors.bold}📡 BASIC CONNECTIVITY TESTS${colors.reset}`, colors.blue);
  tests.push(await testEndpoint('GET', '/'));
  tests.push(await testEndpoint('GET', '/health', null, 200));
  tests.push(await testEndpoint('GET', '/status', null, 200));
  
  // API documentation
  log(`${colors.bold}📚 DOCUMENTATION TESTS${colors.reset}`, colors.blue);
  tests.push(await testEndpoint('GET', '/api-docs'));
  tests.push(await testEndpoint('GET', '/docs'));
  
  // System information
  log(`${colors.bold}🔍 SYSTEM INFORMATION TESTS${colors.reset}`, colors.blue);
  tests.push(await testEndpoint('GET', '/api/system'));
  tests.push(await testEndpoint('GET', '/api/system/info'));
  tests.push(await testEndpoint('GET', '/api/version'));
  
  // Pod management
  log(`${colors.bold}🚀 POD MANAGEMENT TESTS${colors.reset}`, colors.blue);
  tests.push(await testEndpoint('GET', '/api/pods'));
  tests.push(await testEndpoint('GET', '/api/pod-bay'));
  
  // Authentication
  log(`${colors.bold}🔐 AUTHENTICATION TESTS${colors.reset}`, colors.blue);
  tests.push(await testEndpoint('GET', '/api/auth'));
  tests.push(await testEndpoint('GET', '/api/auth/status'));
  
  // Jobs and processes
  log(`${colors.bold}⚙️  JOBS & PROCESSES TESTS${colors.reset}`, colors.blue);
  tests.push(await testEndpoint('GET', '/api/jobs'));
  tests.push(await testEndpoint('GET', '/api/processes'));
  
  // Network and peers
  log(`${colors.bold}🌐 NETWORK TESTS${colors.reset}`, colors.blue);
  tests.push(await testEndpoint('GET', '/api/network'));
  tests.push(await testEndpoint('GET', '/api/peers'));
  tests.push(await testEndpoint('GET', '/api/libp2p'));
  
  // Storage and IPFS
  log(`${colors.bold}💾 STORAGE TESTS${colors.reset}`, colors.blue);
  tests.push(await testEndpoint('GET', '/api/ipfs'));
  tests.push(await testEndpoint('GET', '/api/ipfs/id'));
  tests.push(await testEndpoint('GET', '/api/storage'));
  
  // Database and OrbitDB
  log(`${colors.bold}🗄️  DATABASE TESTS${colors.reset}`, colors.blue);
  tests.push(await testEndpoint('GET', '/api/orbitdb'));
  tests.push(await testEndpoint('GET', '/api/databases'));
  
  // POST endpoint tests
  log(`${colors.bold}📝 POST ENDPOINT TESTS${colors.reset}`, colors.blue);
  tests.push(await testEndpoint('POST', '/api/pod', {
    name: 'test-pod',
    type: 'database'
  }));
  
  // Calculate results
  const successful = tests.filter(t => t.success).length;
  const total = tests.length;
  const failed = total - successful;
  
  log(`\n${colors.bold}📊 TEST RESULTS SUMMARY${colors.reset}`);
  log(`✅ Successful: ${successful}/${total}`, successful > 0 ? colors.green : colors.red);
  log(`❌ Failed: ${failed}/${total}`, failed === 0 ? colors.green : colors.red);
  log(`📈 Success Rate: ${((successful/total) * 100).toFixed(1)}%`);
  
  if (successful > 0) {
    log(`\n🎉 Moonbase API is responding!`, colors.green);
  } else {
    log(`\n😞 No endpoints responded successfully`, colors.red);
  }
  
  return { successful, total, failed };
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
  log(`❌ Unhandled error: ${error.message}`, colors.red);
});

// Run the tests
runAPITests().catch(error => {
  log(`❌ Test suite failed: ${error.message}`, colors.red);
  process.exit(1);
});
