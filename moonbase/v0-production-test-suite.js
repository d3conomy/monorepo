#!/usr/bin/env node

/**
 * MOONBASE v0 PRODUCTION TEST SUITE
 * Comprehensive validation of the v0 API bedrock foundation
 * 
 * This test suite validates:
 * 1. All bedrock endpoints are stable and performant
 * 2. Error handling and edge cases
 * 3. System resilience under load
 * 4. API response consistency
 * 5. Production readiness metrics
 */

import http from 'http';
import { URL } from 'url';

const BASE_URL = 'http://localhost:4343/api/v0';
const TIMEOUT = 15000;
const MAX_RETRIES = 3;

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

// Production metrics tracking
const metrics = {
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  totalResponseTime: 0,
  slowestResponse: 0,
  fastestResponse: Infinity,
  errors: [],
  warnings: []
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function updateMetrics(responseTime, success, error = null) {
  metrics.totalTests++;
  metrics.totalResponseTime += responseTime;
  
  if (success) {
    metrics.passedTests++;
  } else {
    metrics.failedTests++;
    if (error) metrics.errors.push(error);
  }
  
  if (responseTime > metrics.slowestResponse) {
    metrics.slowestResponse = responseTime;
  }
  if (responseTime < metrics.fastestResponse) {
    metrics.fastestResponse = responseTime;
  }
}

async function makeRequest(method, url, data = null, timeout = TIMEOUT) {
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
      timeout: timeout
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
          headers: res.headers,
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

async function runTestWithRetry(testFn, retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      return await testFn();
    } catch (error) {
      if (i === retries - 1) throw error;
      log(`   🔄 Retry ${i + 1}/${retries}`, colors.yellow);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

async function testEndpoint(name, method, endpoint, data = null, expectedStatus = 200) {
  try {
    const result = await runTestWithRetry(async () => {
      return await makeRequest(method, `${BASE_URL}${endpoint}`, data);
    });
    
    const isSuccess = result.statusCode === expectedStatus;
    updateMetrics(result.responseTime, isSuccess, isSuccess ? null : `${name}: Expected ${expectedStatus}, got ${result.statusCode}`);
    
    const statusColor = isSuccess ? colors.green : colors.red;
    const statusSymbol = isSuccess ? '✅' : '❌';
    
    log(`   ${statusSymbol} ${result.statusCode} ${result.statusCode === expectedStatus ? 'OK' : 'FAIL'} (${result.responseTime}ms)`, statusColor);
    
    // Performance warnings
    if (result.responseTime > 1000 && isSuccess) {
      metrics.warnings.push(`${name}: Slow response (${result.responseTime}ms)`);
      log(`   ⚠️  Slow response: ${result.responseTime}ms`, colors.yellow);
    }
    
    return result;
  } catch (error) {
    updateMetrics(error.responseTime || 0, false, `${name}: ${error.error}`);
    log(`   ❌ ERROR (${error.responseTime || 0}ms)`, colors.red);
    log(`   📄 ${error.error}`, colors.red);
    throw error;
  }
}

async function healthCheck() {
  log(`\n🏥 PRODUCTION HEALTH CHECK`, colors.magenta + colors.bold);
  
  try {
    const result = await testEndpoint('Health Check', 'GET', '/ping');
    
    if (result.statusCode === 200) {
      log(`✅ Server is healthy and ready for production testing\n`, colors.green);
      return true;
    } else {
      log(`❌ Server health check failed\n`, colors.red);
      return false;
    }
  } catch (error) {
    log(`❌ Server is not responding - cannot proceed with tests\n`, colors.red);
    return false;
  }
}

async function runBedrockTests() {
  log(`🗿 BEDROCK FOUNDATION TESTS`, colors.cyan + colors.bold);
  log(`These are our proven, reliable endpoints that form the v0 foundation\n`);
  
  const bedrockTests = [
    {
      name: 'Ping - System heartbeat',
      method: 'GET',
      endpoint: '/ping',
      description: 'Basic connectivity and system responsiveness'
    },
    {
      name: 'List logbooks',
      method: 'GET',
      endpoint: '/logbooks',
      description: 'System logging infrastructure'
    },
    {
      name: 'Get recent logs',
      method: 'GET',
      endpoint: '/logs',
      description: 'Log retrieval and monitoring'
    },
    {
      name: 'List all pods',
      method: 'GET',
      endpoint: '/pods',
      description: 'Pod management and discovery'
    },
    {
      name: 'Get system pod details',
      method: 'GET',
      endpoint: '/pod/system',
      description: 'System pod inspection'
    },
    {
      name: 'System pod status',
      method: 'POST',
      endpoint: '/pod/system',
      data: { command: 'status' },
      description: 'System status reporting'
    },
    {
      name: 'List filesystems',
      method: 'GET',
      endpoint: '/fs',
      description: 'Filesystem management'
    },
    {
      name: 'List open databases',
      method: 'GET',
      endpoint: '/open',
      description: 'Database connection management'
    },
    {
      name: 'List PubSub topics',
      method: 'GET',
      endpoint: '/pubsub/topics',
      description: 'Communication infrastructure'
    }
  ];
  
  for (const test of bedrockTests) {
    log(`🗿 ${test.name}`, colors.cyan);
    log(`   ${test.method} ${test.endpoint}`, colors.dim);
    log(`   ${test.description}`, colors.dim);
    
    if (test.data) {
      log(`   📤 ${JSON.stringify(test.data, null, 2).split('\n').join('\n   ')}`, colors.dim);
    }
    
    try {
      const result = await testEndpoint(test.name, test.method, test.endpoint, test.data);
      
      // Log response preview
      if (typeof result.body === 'object') {
        if (Array.isArray(result.body)) {
          log(`   📄 Array with ${result.body.length} items`, colors.dim);
          if (result.body.length > 0) {
            log(`     [0]: ${typeof result.body[0] === 'object' ? JSON.stringify(result.body[0]).substring(0, 100) + '...' : result.body[0]}`, colors.dim);
          }
        } else {
          const keys = Object.keys(result.body);
          log(`   📄 Object with keys: ${keys.join(', ')}`, colors.dim);
          keys.slice(0, 3).forEach(key => {
            const value = result.body[key];
            const preview = Array.isArray(value) ? `[${value.length} items]` : 
                           typeof value === 'object' ? '[object]' : 
                           String(value).substring(0, 50);
            log(`     ${key}: ${preview}`, colors.dim);
          });
        }
      } else {
        log(`   📄 "${result.body}"`, colors.dim);
      }
    } catch (error) {
      // Continue with other tests even if one fails
    }
    
    log(''); // Empty line for readability
  }
}

async function runStabilityTests() {
  log(`🔧 STABILITY & RESILIENCE TESTS`, colors.blue + colors.bold);
  log(`Testing system behavior under various conditions\n`);
  
  // Test rapid sequential requests
  log(`🔧 Rapid sequential requests test`, colors.blue);
  const rapidTests = [];
  for (let i = 0; i < 5; i++) {
    rapidTests.push(testEndpoint(`Rapid ping ${i+1}`, 'GET', '/ping'));
  }
  
  try {
    await Promise.all(rapidTests);
    log(`   ✅ All rapid requests completed successfully`, colors.green);
  } catch (error) {
    log(`   ⚠️  Some rapid requests failed`, colors.yellow);
  }
  
  log('');
  
  // Test error handling
  log(`🔧 Error handling tests`, colors.blue);
  
  try {
    await testEndpoint('Non-existent endpoint', 'GET', '/nonexistent', null, 404);
  } catch (error) {
    // Expected to fail
  }
  
  try {
    await testEndpoint('Invalid pod', 'GET', '/pod/invalid-pod-id', null, 404);
  } catch (error) {
    // Expected to fail
  }
  
  log('');
}

async function runPerformanceTests() {
  log(`⚡ PERFORMANCE VALIDATION`, colors.yellow + colors.bold);
  log(`Ensuring production-ready response times\n`);
  
  const performanceTests = [
    { name: 'Ping latency', endpoint: '/ping', maxTime: 100 },
    { name: 'Logbooks response', endpoint: '/logbooks', maxTime: 500 },
    { name: 'Pods listing', endpoint: '/pods', maxTime: 500 },
    { name: 'System status', endpoint: '/pod/system', maxTime: 1000, method: 'POST', data: { command: 'status' } }
  ];
  
  for (const test of performanceTests) {
    log(`⚡ ${test.name} (target: <${test.maxTime}ms)`, colors.yellow);
    
    try {
      const result = await testEndpoint(test.name, test.method || 'GET', test.endpoint, test.data);
      
      if (result.responseTime <= test.maxTime) {
        log(`   🎯 Excellent: ${result.responseTime}ms`, colors.green);
      } else {
        log(`   ⚠️  Slow: ${result.responseTime}ms (target: ${test.maxTime}ms)`, colors.yellow);
        metrics.warnings.push(`${test.name}: Response time ${result.responseTime}ms exceeds target ${test.maxTime}ms`);
      }
    } catch (error) {
      // Already logged in testEndpoint
    }
    
    log('');
  }
}

function generateReport() {
  log(`\n📊 PRODUCTION READINESS REPORT`, colors.magenta + colors.bold);
  log(`=====================================\n`);
  
  // Overall metrics
  const successRate = ((metrics.passedTests / metrics.totalTests) * 100).toFixed(1);
  const avgResponseTime = (metrics.totalResponseTime / metrics.totalTests).toFixed(1);
  
  log(`📈 Test Results:`);
  log(`   Total Tests: ${metrics.totalTests}`);
  log(`   Passed: ${metrics.passedTests} (${successRate}%)`);
  log(`   Failed: ${metrics.failedTests}`);
  log(`   Success Rate: ${successRate}%`, successRate >= 95 ? colors.green : successRate >= 80 ? colors.yellow : colors.red);
  
  log(`\n⏱️  Performance Metrics:`);
  log(`   Average Response Time: ${avgResponseTime}ms`);
  log(`   Fastest Response: ${metrics.fastestResponse}ms`);
  log(`   Slowest Response: ${metrics.slowestResponse}ms`);
  
  // Production readiness assessment
  log(`\n🎯 Production Readiness Assessment:`);
  
  const isProductionReady = successRate >= 95 && avgResponseTime <= 500 && metrics.slowestResponse <= 2000;
  
  if (isProductionReady) {
    log(`   ✅ PRODUCTION READY`, colors.green + colors.bold);
    log(`   The v0 API bedrock is stable and ready for production deployment.`);
  } else {
    log(`   ⚠️  NEEDS ATTENTION`, colors.yellow + colors.bold);
    log(`   Some issues need to be addressed before production deployment.`);
  }
  
  // Warnings and errors
  if (metrics.warnings.length > 0) {
    log(`\n⚠️  Warnings (${metrics.warnings.length}):`);
    metrics.warnings.forEach(warning => {
      log(`   • ${warning}`, colors.yellow);
    });
  }
  
  if (metrics.errors.length > 0) {
    log(`\n❌ Errors (${metrics.errors.length}):`);
    metrics.errors.forEach(error => {
      log(`   • ${error}`, colors.red);
    });
  }
  
  log(`\n🗿 Bedrock Foundation Status: ${successRate >= 90 ? 'SOLID' : 'NEEDS WORK'}`, successRate >= 90 ? colors.green : colors.red);
  log(`The v0 API provides a ${successRate >= 90 ? 'reliable' : 'developing'} foundation for the Moonbase system.\n`);
}

async function main() {
  log(`🚀 MOONBASE v0 PRODUCTION TEST SUITE`, colors.cyan + colors.bold);
  log(`=====================================`);
  log(`Comprehensive validation of our bedrock foundation\n`);
  
  // Health check first
  const isHealthy = await healthCheck();
  if (!isHealthy) {
    process.exit(1);
  }
  
  try {
    // Run all test suites
    await runBedrockTests();
    await runStabilityTests();
    await runPerformanceTests();
    
    // Generate final report
    generateReport();
    
  } catch (error) {
    log(`\n💥 Test suite encountered an error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Run the test suite
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
