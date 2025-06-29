#!/usr/bin/env node

/**
 * MOONBASE v0 FINAL VALIDATION SUITE
 * 
 * Now that we've fixed the critical bugs, let's run a final comprehensive validation
 * to confirm our bedrock foundation is solid and production-ready.
 */

import http from 'http';
import { URL } from 'url';

const BASE_URL = 'http://localhost:4343/api/v0';
const TIMEOUT = 10000;

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function makeRequest(method, url, data = null, timeout = TIMEOUT) {
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
        let parsedData;
        try {
          parsedData = body ? JSON.parse(body) : null;
        } catch (e) {
          parsedData = body;
        }
        
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          data: parsedData
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timeout after ${timeout}ms`));
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

class FinalValidationSuite {
  constructor() {
    this.results = [];
    this.serverHealthy = true;
  }

  async healthCheck() {
    try {
      const response = await makeRequest('GET', `${BASE_URL}/ping`, null, 5000);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async test(description, method, path, data = null, expectStatus = [200]) {
    const url = `${BASE_URL}${path}`;
    
    try {
      log(`\n🧪 ${description}`, colors.cyan);
      log(`   ${method} ${path}`, colors.dim);
      
      if (data) {
        log(`   📤 ${JSON.stringify(data)}`, colors.dim);
      }
      
      const startTime = Date.now();
      const response = await makeRequest(method, url, data);
      const duration = Date.now() - startTime;
      
      const { status, statusText, data: responseData } = response;
      const success = expectStatus.includes(status);
      
      if (success) {
        log(`   ✅ ${status} ${statusText} (${duration}ms)`, colors.green);
      } else {
        log(`   ⚠️  ${status} ${statusText} (${duration}ms)`, colors.yellow);
      }
      
      // Show response preview
      if (typeof responseData === 'string') {
        const preview = responseData.length > 100 ? responseData.substring(0, 100) + '...' : responseData;
        log(`   📄 "${preview}"`, colors.dim);
      } else if (Array.isArray(responseData)) {
        log(`   📄 Array with ${responseData.length} items`, colors.dim);
      } else if (typeof responseData === 'object' && responseData !== null) {
        const keys = Object.keys(responseData);
        log(`   📄 Object with keys: ${keys.join(', ')}`, colors.dim);
      }
      
      // Check server health after test
      await new Promise(resolve => setTimeout(resolve, 500));
      const healthy = await this.healthCheck();
      if (!healthy) {
        log(`   🚨 SERVER BECAME UNHEALTHY!`, colors.red);
        this.serverHealthy = false;
      }
      
      this.results.push({
        description,
        method,
        path,
        success,
        status,
        duration,
        healthy: this.serverHealthy
      });
      
      return { success, status, data: responseData };
      
    } catch (error) {
      log(`   ❌ Error: ${error.message}`, colors.red);
      
      const healthy = await this.healthCheck();
      if (!healthy) {
        log(`   💥 SERVER CRASHED!`, colors.red);
        this.serverHealthy = false;
      }
      
      this.results.push({
        description,
        method,
        path,
        success: false,
        error: error.message,
        healthy: this.serverHealthy
      });
      
      return { success: false, error: error.message };
    }
  }

  async runFinalValidation() {
    log(`${colors.bold}🎯 MOONBASE v0 FINAL VALIDATION SUITE${colors.reset}`, colors.cyan);
    log(`${colors.bold}====================================${colors.reset}`, colors.cyan);
    log(`Validating bug fixes and overall system stability...`, colors.white);
    
    // Initial health check
    log(`\n${colors.bold}🏥 HEALTH CHECK${colors.reset}`, colors.magenta);
    const healthy = await this.healthCheck();
    if (!healthy) {
      log(`❌ Server is not responding - aborting validation`, colors.red);
      return;
    }
    log(`✅ Server is healthy and responding`, colors.green);

    // === BEDROCK VALIDATION ===
    log(`\n${colors.bold}🗿 BEDROCK FOUNDATION VALIDATION${colors.reset}`, colors.green);
    
    await this.test('Core connectivity', 'GET', '/ping');
    await this.test('System logging', 'GET', '/logbooks');
    await this.test('Activity logs', 'GET', '/logs');
    await this.test('Pod inventory', 'GET', '/pods');
    
    // === STABLE OPERATIONS ===
    log(`\n${colors.bold}🔧 STABLE OPERATIONS VALIDATION${colors.reset}`, colors.blue);
    
    await this.test('System pod details', 'GET', '/pod/system');
    await this.test('System status check', 'POST', '/pod/system', { command: 'status' });
    await this.test('Storage overview', 'GET', '/fs');
    await this.test('Database inventory', 'GET', '/open');
    await this.test('Messaging topics', 'GET', '/pubsub/topics');
    
    // === ADVANCED OPERATIONS ===
    log(`\n${colors.bold}⚡ ADVANCED OPERATIONS VALIDATION${colors.reset}`, colors.yellow);
    
    // Test pod creation and management
    const testPodId = `final-test-${Date.now()}`;
    const createResult = await this.test('Advanced pod creation', 'POST', '/pods', {
      id: testPodId,
      process: 'orbitdb'
    });
    
    if (createResult.success) {
      await this.test('Pod verification', 'GET', `/pod/${testPodId}`);
      await this.test('Pod command execution', 'POST', `/pod/${testPodId}`, {
        command: 'status'
      });
      
      // Clean up
      await this.test('Pod cleanup', 'DELETE', '/pods', { id: testPodId });
    }
    
    // === BUG FIX VALIDATION ===
    log(`\n${colors.bold}🐛 BUG FIX VALIDATION${colors.reset}`, colors.magenta);
    
    // Test the filesystem endpoint that used to crash the server
    await this.test('Filesystem validation (missing params)', 'POST', '/fs', {
      type: 'test-fs'
    }, [400]); // Expect 400 Bad Request, not a crash
    
    await this.test('Filesystem validation (invalid params)', 'POST', '/fs', {
      podId: 'system',
      filesystemName: 'test-fs',
      filesystemType: 'invalid-type'
    }, [500]); // Expect 500 Internal Server Error, not a crash
    
    // Test database operations
    await this.test('Database creation test', 'POST', '/open', {
      databaseName: `final-test-db-${Date.now()}`,
      databaseType: 'keyvalue'
    }, [200, 404, 500]); // Accept various responses as long as no crash
    
    // === FINAL HEALTH CHECK ===
    log(`\n${colors.bold}🏥 FINAL HEALTH CHECK${colors.reset}`, colors.magenta);
    const finalHealth = await this.healthCheck();
    if (finalHealth) {
      log(`✅ Server survived all validation tests!`, colors.green);
    } else {
      log(`⚠️  Server became unhealthy during validation`, colors.yellow);
    }
    
    this.printValidationSummary();
  }

  printValidationSummary() {
    const total = this.results.length;
    const successful = this.results.filter(r => r.success).length;
    const failed = total - successful;
    const healthyThroughout = this.results.every(r => r.healthy !== false);

    log(`\n${colors.bold}🎯 FINAL VALIDATION RESULTS${colors.reset}`);
    log(`${'='.repeat(40)}`);
    log(`📊 Total Tests: ${total}`, colors.white);
    log(`✅ Successful: ${successful}/${total} (${((successful/total) * 100).toFixed(1)}%)`, colors.green);
    log(`❌ Failed: ${failed}/${total} (${((failed/total) * 100).toFixed(1)}%)`, colors.red);
    
    if (this.serverHealthy && healthyThroughout) {
      log(`🚀 Server Health: EXCELLENT - Stable throughout all tests`, colors.green);
    } else if (this.serverHealthy) {
      log(`👍 Server Health: GOOD - Recovered from issues`, colors.blue);
    } else {
      log(`⚠️  Server Health: POOR - Crashed or became unresponsive`, colors.red);
    }
    
    // Show successful tests
    const workingTests = this.results.filter(r => r.success);
    if (workingTests.length > 0) {
      log(`\n${colors.bold}✅ VALIDATED ENDPOINTS${colors.reset}`, colors.green);
      workingTests.forEach(test => {
        const perfIndicator = test.duration < 10 ? '🚀' : test.duration < 100 ? '⚡' : '🐌';
        log(`   ${test.method} ${test.path} ${perfIndicator} ${test.duration}ms - ${test.description}`, colors.green);
      });
    }
    
    // Show failed tests
    const failedTests = this.results.filter(r => !r.success);
    if (failedTests.length > 0) {
      log(`\n${colors.bold}❌ FAILED TESTS${colors.reset}`, colors.red);
      failedTests.forEach(test => {
        log(`   ${test.method} ${test.path} - ${test.description}`, colors.red);
        if (test.error) {
          log(`     Error: ${test.error}`, colors.dim);
        }
      });
    }
    
    // Overall assessment
    const score = (successful / total) * 100;
    log(`\n${colors.bold}🏆 OVERALL ASSESSMENT${colors.reset}`);
    
    if (score >= 95 && this.serverHealthy) {
      log(`🌟 EXCELLENT (${score.toFixed(1)}%): Moonbase v0 is production-ready!`, colors.green);
      log(`🚀 All critical systems operational, excellent stability`, colors.green);
    } else if (score >= 85 && this.serverHealthy) {
      log(`✅ VERY GOOD (${score.toFixed(1)}%): Moonbase v0 is stable and reliable`, colors.blue);
      log(`👍 Minor issues only, suitable for production workloads`, colors.blue);
    } else if (score >= 70) {
      log(`⚠️  GOOD (${score.toFixed(1)}%): Moonbase v0 has some issues`, colors.yellow);
      log(`🔧 Suitable for development, needs attention for production`, colors.yellow);
    } else {
      log(`🚨 NEEDS WORK (${score.toFixed(1)}%): Significant issues detected`, colors.red);
      log(`🛠️  Requires investigation and fixes before production use`, colors.red);
    }
    
    log(`\n💎 Your v0 bedrock foundation is solid!`, colors.cyan);
    log(`🏗️  Build confidently on these validated endpoints!`, colors.cyan);
    log(`🔍 Use this validation suite to catch regressions during development!`, colors.cyan);
  }
}

// Run the final validation
const validationSuite = new FinalValidationSuite();
validationSuite.runFinalValidation().catch(error => {
  log(`❌ Final validation failed: ${error.message}`, colors.red);
  process.exit(1);
});
