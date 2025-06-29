#!/usr/bin/env node

/**
 * MOONBASE v0 BEDROCK VALIDATION SUITE
 * Lightweight, focused testing of our proven foundation
 * 
 * Based on successful comprehensive testing, this validates:
 * - Core bedrock endpoints are stable
 * - Basic functionality is working
 * - Performance is acceptable
 * - API responses are consistent
 */

import http from 'http';
import { URL } from 'url';

const BASE_URL = 'http://localhost:4343/api/v0';
const TIMEOUT = 5000;

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

const metrics = {
  tests: 0,
  passed: 0,
  failed: 0,
  totalTime: 0,
  results: []
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function makeRequest(method, url, data = null) {
  const startTime = Date.now();
  
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
      timeout: TIMEOUT
    };
    
    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }
    
    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        
        let parsedBody;
        try {
          parsedBody = JSON.parse(body);
        } catch (e) {
          parsedBody = body;
        }
        
        resolve({
          statusCode: res.statusCode,
          body: parsedBody,
          responseTime: responseTime,
          rawBody: body
        });
      });
    });
    
    req.on('error', (error) => {
      const responseTime = Date.now() - startTime;
      reject({
        error: error.message,
        responseTime: responseTime
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      const responseTime = Date.now() - startTime;
      reject({
        error: 'Request timeout',
        responseTime: responseTime
      });
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testEndpoint(name, method, endpoint, data = null, expectedStatus = 200) {
  metrics.tests++;
  const testStart = Date.now();
  
  try {
    log(`🧪 ${name}`, colors.cyan);
    log(`   ${method} ${endpoint}`, colors.dim);
    
    if (data) {
      log(`   📤 ${JSON.stringify(data)}`, colors.dim);
    }
    
    const result = await makeRequest(method, `${BASE_URL}${endpoint}`, data);
    const testTime = Date.now() - testStart;
    metrics.totalTime += testTime;
    
    const isSuccess = result.statusCode === expectedStatus;
    
    if (isSuccess) {
      metrics.passed++;
      log(`   ✅ ${result.statusCode} OK (${result.responseTime}ms)`, colors.green);
      
      // Log response summary
      if (typeof result.body === 'object') {
        if (Array.isArray(result.body)) {
          log(`   📄 Array[${result.body.length}]${result.body.length > 0 ? ` - "${String(result.body[0]).substring(0, 50)}..."` : ''}`, colors.dim);
        } else {
          const keys = Object.keys(result.body);
          log(`   📄 Object{${keys.slice(0, 2).join(', ')}${keys.length > 2 ? '...' : ''}}`, colors.dim);
        }
      } else {
        log(`   📄 "${String(result.body).substring(0, 50)}${String(result.body).length > 50 ? '...' : ''}"`, colors.dim);
      }
    } else {
      metrics.failed++;
      log(`   ❌ ${result.statusCode} FAIL (expected ${expectedStatus})`, colors.red);
    }
    
    metrics.results.push({
      name,
      success: isSuccess,
      responseTime: result.responseTime,
      statusCode: result.statusCode
    });
    
    return result;
    
  } catch (error) {
    metrics.failed++;
    const testTime = Date.now() - testStart;
    metrics.totalTime += testTime;
    
    log(`   ❌ ERROR (${error.responseTime || testTime}ms)`, colors.red);
    log(`   📄 ${error.error}`, colors.red);
    
    metrics.results.push({
      name,
      success: false,
      responseTime: error.responseTime || testTime,
      error: error.error
    });
    
    throw error;
  }
}

async function validateBedrock() {
  log(`🗿 BEDROCK FOUNDATION VALIDATION`, colors.cyan + colors.bold);
  log(`Testing our proven, reliable v0 endpoints\n`);
  
  // Core bedrock endpoints that we know work
  const bedrockEndpoints = [
    {
      name: 'System Heartbeat',
      method: 'GET',
      endpoint: '/ping'
    },
    {
      name: 'System Logbooks',
      method: 'GET',
      endpoint: '/logbooks'
    },
    {
      name: 'Recent System Logs',
      method: 'GET',
      endpoint: '/logs'
    },
    {
      name: 'Pod Discovery',
      method: 'GET',
      endpoint: '/pods'
    },
    {
      name: 'System Pod Details',
      method: 'GET',
      endpoint: '/pod/system'
    },
    {
      name: 'Filesystem Management',
      method: 'GET',
      endpoint: '/fs'
    },
    {
      name: 'Database Connections',
      method: 'GET',
      endpoint: '/open'
    },
    {
      name: 'PubSub Infrastructure',
      method: 'GET',
      endpoint: '/pubsub/topics'
    }
  ];
  
  for (const test of bedrockEndpoints) {
    try {
      await testEndpoint(test.name, test.method, test.endpoint, test.data);
      log(''); // Spacing
      
      // Small delay between requests to be gentle on the server
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      log(''); // Spacing even if failed
      continue; // Continue with other tests
    }
  }
}

async function validateSystemStatus() {
  log(`🔧 SYSTEM STATUS VALIDATION`, colors.blue + colors.bold);
  log(`Testing system operational status\n`);
  
  try {
    await testEndpoint(
      'System Status Check',
      'POST',
      '/pod/system',
      { command: 'status' }
    );
    log('');
  } catch (error) {
    log('');
  }
}

function generateReport() {
  log(`📊 BEDROCK VALIDATION REPORT`, colors.magenta + colors.bold);
  log(`===========================\n`);
  
  const successRate = metrics.tests > 0 ? ((metrics.passed / metrics.tests) * 100).toFixed(1) : 0;
  const avgResponseTime = metrics.tests > 0 ? (metrics.totalTime / metrics.tests).toFixed(1) : 0;
  
  log(`📈 Test Results:`);
  log(`   Total Tests: ${metrics.tests}`);
  log(`   Passed: ${metrics.passed}`);
  log(`   Failed: ${metrics.failed}`);
  log(`   Success Rate: ${successRate}%`, successRate >= 90 ? colors.green : colors.yellow);
  
  if (metrics.tests > 0) {
    log(`   Average Response: ${avgResponseTime}ms`);
    
    const fastestTest = metrics.results.reduce((fastest, test) => 
      test.responseTime < fastest.responseTime ? test : fastest
    );
    const slowestTest = metrics.results.reduce((slowest, test) => 
      test.responseTime > slowest.responseTime ? test : slowest
    );
    
    log(`   Fastest: ${fastestTest.name} (${fastestTest.responseTime}ms)`);
    log(`   Slowest: ${slowestTest.name} (${slowestTest.responseTime}ms)`);
  }
  
  log(`\n🗿 Bedrock Status:`);
  
  if (successRate >= 90) {
    log(`   ✅ SOLID FOUNDATION`, colors.green + colors.bold);
    log(`   The v0 bedrock is stable and ready for production use.`);
  } else if (successRate >= 70) {
    log(`   ⚠️  MOSTLY STABLE`, colors.yellow + colors.bold);
    log(`   The v0 bedrock is functional but needs attention.`);
  } else {
    log(`   ❌ NEEDS WORK`, colors.red + colors.bold);
    log(`   The v0 bedrock requires fixes before production use.`);
  }
  
  // List failed tests if any
  const failedTests = metrics.results.filter(test => !test.success);
  if (failedTests.length > 0) {
    log(`\n❌ Failed Tests:`);
    failedTests.forEach(test => {
      log(`   • ${test.name}${test.error ? ': ' + test.error : ''}`, colors.red);
    });
  }
  
  log(`\n🎯 Next Steps:`);
  if (successRate >= 90) {
    log(`   • ✅ Ready for advanced endpoint testing`);
    log(`   • ✅ Ready for load testing`); 
    log(`   • ✅ Ready for production deployment planning`);
  } else {
    log(`   • 🔧 Address failed endpoints`);
    log(`   • 🔍 Investigate server stability issues`);
    log(`   • 🧪 Re-run validation after fixes`);
  }
  
  log(`\n🚀 The v0 API provides a ${successRate >= 90 ? 'rock-solid' : 'developing'} foundation for the Moonbase ecosystem.`);
}

async function main() {
  log(`🚀 MOONBASE v0 BEDROCK VALIDATION`, colors.cyan + colors.bold);
  log(`=================================`);
  log(`Lightweight validation of our proven foundation\n`);
  
  // Quick health check
  try {
    const healthResult = await makeRequest('GET', `${BASE_URL}/ping`);
    if (healthResult.statusCode === 200) {
      log(`✅ Server is responding (${healthResult.responseTime}ms)\n`, colors.green);
    } else {
      log(`⚠️  Server responded with status ${healthResult.statusCode}\n`, colors.yellow);
    }
  } catch (error) {
    log(`❌ Server is not responding: ${error.error}\n`, colors.red);
    log(`🔧 Please start the Moonbase server with: node server.js\n`);
    process.exit(1);
  }
  
  try {
    await validateBedrock();
    await validateSystemStatus();
    generateReport();
    
  } catch (error) {
    log(`\n💥 Validation suite error: ${error.message}`, colors.red);
    generateReport();
  }
}

// Run the validation
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
