#!/usr/bin/env node

/**
 * MOONBASE v0 BEDROCK TEST SUITE
 * Focus on core working endpoints - our reliable foundation
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

class BedrockTestSuite {
  constructor() {
    this.results = [];
    this.serverHealthy = true;
  }

  async healthCheck() {
    try {
      const response = await makeRequest('GET', `${BASE_URL}/ping`, null, 3000);
      this.serverHealthy = response.status === 200;
      return this.serverHealthy;
    } catch (error) {
      this.serverHealthy = false;
      return false;
    }
  }

  async test(description, method, path, data = null, options = {}) {
    const {
      expectSuccess = true,
      timeout = TIMEOUT,
      skipIfUnhealthy = true
    } = options;

    if (skipIfUnhealthy && !this.serverHealthy) {
      log(`   ⏭️  Skipping: ${description} (server unhealthy)`, colors.yellow);
      return { description, skipped: true };
    }

    const url = `${BASE_URL}${path}`;
    
    try {
      log(`\n🧪 ${description}`, colors.cyan);
      log(`   ${method} ${path}`, colors.dim);
      
      if (data) {
        log(`   📤 ${JSON.stringify(data)}`, colors.dim);
      }
      
      const startTime = Date.now();
      const response = await makeRequest(method, url, data, timeout);
      const duration = Date.now() - startTime;
      
      const { status, statusText, data: responseData } = response;
      const success = expectSuccess ? (status >= 200 && status < 300) : true;
      
      if (success) {
        log(`   ✅ ${status} ${statusText} (${duration}ms)`, colors.green);
      } else {
        log(`   ⚠️  ${status} ${statusText} (${duration}ms)`, colors.yellow);
      }
      
      // Show formatted response
      if (typeof responseData === 'object' && responseData !== null) {
        if (Array.isArray(responseData)) {
          log(`   📄 Array with ${responseData.length} items`, colors.dim);
          if (responseData.length > 0 && responseData.length <= 3) {
            responseData.forEach((item, i) => {
              const preview = typeof item === 'object' ? JSON.stringify(item).substring(0, 100) : item;
              log(`     [${i}]: ${preview}${JSON.stringify(item).length > 100 ? '...' : ''}`, colors.dim);
            });
          }
        } else {
          const keys = Object.keys(responseData);
          log(`   📄 Object with keys: ${keys.join(', ')}`, colors.dim);
          if (keys.length <= 5) {
            Object.entries(responseData).forEach(([key, value]) => {
              const preview = typeof value === 'object' ? JSON.stringify(value).substring(0, 50) : value;
              log(`     ${key}: ${preview}${JSON.stringify(value).length > 50 ? '...' : ''}`, colors.dim);
            });
          }
        }
      } else {
        log(`   📄 ${responseData}`, colors.dim);
      }
      
      const result = {
        description,
        method,
        path,
        status,
        success,
        duration,
        data: responseData
      };
      
      this.results.push(result);
      return result;
      
    } catch (error) {
      log(`   ❌ ERROR: ${error.message}`, colors.red);
      
      // Check if server crashed
      if (error.message.includes('ECONNREFUSED') || error.message.includes('socket hang up')) {
        this.serverHealthy = false;
        log(`   🚨 Server appears to have crashed!`, colors.red);
      }
      
      const result = {
        description,
        method,
        path,
        status: 0,
        success: false,
        error: error.message
      };
      this.results.push(result);
      return result;
    }
  }

  async runBedrockTests() {
    log(`${colors.bold}🗿 MOONBASE v0 BEDROCK TEST SUITE${colors.reset}`, colors.blue);
    log(`🎯 Testing reliable foundation endpoints`);
    log(`🔗 API Base: ${BASE_URL}\n`);
    
    // Initial health check
    log(`${colors.bold}🏥 HEALTH CHECK${colors.reset}`, colors.magenta);
    const healthy = await this.healthCheck();
    if (healthy) {
      log(`✅ Server is healthy and responding`, colors.green);
    } else {
      log(`❌ Server is not responding - aborting tests`, colors.red);
      return;
    }
    
    // === CORE MONITORING (Bedrock Level 1) ===
    log(`\n${colors.bold}🗿 BEDROCK LEVEL 1: CORE MONITORING${colors.reset}`, colors.magenta);
    await this.test('Ping - Basic connectivity', 'GET', '/ping');
    await this.test('Logbooks - System logging', 'GET', '/logbooks');
    await this.test('Recent logs - Activity monitoring', 'GET', '/logs');
    
    // === DOCUMENTATION & API INFO (Bedrock Level 2) ===
    log(`\n${colors.bold}📚 BEDROCK LEVEL 2: DOCUMENTATION${colors.reset}`, colors.magenta);
    await this.test('API Documentation - Swagger UI', 'GET', '/docs/');
    
    // === POD SYSTEM (Bedrock Level 3) ===
    log(`\n${colors.bold}🚀 BEDROCK LEVEL 3: POD SYSTEM${colors.reset}`, colors.magenta);
    const podsResult = await this.test('List all pods - System overview', 'GET', '/pods');
    
    // Analyze pod data
    if (podsResult.success && Array.isArray(podsResult.data)) {
      log(`   🔍 Found ${podsResult.data.length} pods in the system`, colors.blue);
      podsResult.data.forEach((podData, i) => {
        if (podData.pod && podData.pod.name) {
          const processCount = podData.processTypes ? podData.processTypes.length : 0;
          log(`     Pod ${i + 1}: ${podData.pod.name} (${processCount} processes)`, colors.dim);
        }
      });
      
      // Test first pod if available
      if (podsResult.data.length > 0 && podsResult.data[0].pod && podsResult.data[0].pod.name) {
        const firstPodName = podsResult.data[0].pod.name;
        await this.test(`Get pod details - ${firstPodName}`, 'GET', `/pod/${firstPodName}`);
        await this.test(`Pod status command - ${firstPodName}`, 'POST', `/pod/${firstPodName}`, {
          command: 'status'
        });
      }
    }
    
    // === FILESYSTEM (Bedrock Level 4) ===
    log(`\n${colors.bold}📁 BEDROCK LEVEL 4: STORAGE FOUNDATION${colors.reset}`, colors.magenta);
    await this.test('List filesystems - Storage overview', 'GET', '/fs');
    
    // === SAFE POD CREATION TEST ===
    log(`\n${colors.bold}🧪 SAFE OPERATIONS TEST${colors.reset}`, colors.magenta);
    const testPodId = `bedrock-test-${Date.now()}`;
    const createResult = await this.test('Create test pod - Safe operation', 'POST', '/pods', {
      id: testPodId,
      process: 'orbitdb'
    });
    
    if (createResult.success && this.serverHealthy) {
      await this.test(`Verify test pod creation - ${testPodId}`, 'GET', `/pod/${testPodId}`);
      
      // Basic pod operations that shouldn't crash the server
      await this.test(`Safe pod command - ${testPodId}`, 'POST', `/pod/${testPodId}`, {
        command: 'status'
      });
    }
    
    // Final health check
    log(`\n${colors.bold}🏥 FINAL HEALTH CHECK${colors.reset}`, colors.magenta);
    const finalHealth = await this.healthCheck();
    if (finalHealth) {
      log(`✅ Server survived all bedrock tests!`, colors.green);
    } else {
      log(`⚠️  Server became unhealthy during testing`, colors.yellow);
    }
    
    this.printBedrockSummary();
  }

  printBedrockSummary() {
    const successful = this.results.filter(r => r.success).length;
    const total = this.results.length;
    const failed = total - successful;

    log(`\n${colors.bold}🗿 BEDROCK TEST RESULTS${colors.reset}`);
    log(`${'='.repeat(40)}`);
    log(`✅ Reliable: ${successful}/${total}`, successful === total ? colors.green : colors.yellow);
    log(`❌ Issues: ${failed}/${total}`, failed === 0 ? colors.green : colors.red);
    log(`🗿 Foundation Strength: ${((successful/total) * 100).toFixed(0)}%`);
    
    if (this.serverHealthy) {
      log(`🚀 Server Status: HEALTHY`, colors.green);
    } else {
      log(`⚠️  Server Status: CRASHED/UNHEALTHY`, colors.red);
    }
    
    // Show working endpoints
    const workingEndpoints = this.results.filter(r => r.success);
    if (workingEndpoints.length > 0) {
      log(`\n${colors.bold}✅ BEDROCK ENDPOINTS (RELIABLE)${colors.reset}`, colors.green);
      workingEndpoints.forEach(endpoint => {
        log(`   ${endpoint.method} ${endpoint.path} - ${endpoint.description}`, colors.green);
      });
    }
    
    const failedEndpoints = this.results.filter(r => !r.success);
    if (failedEndpoints.length > 0) {
      log(`\n${colors.bold}⚠️  UNSTABLE ENDPOINTS${colors.reset}`, colors.yellow);
      failedEndpoints.forEach(endpoint => {
        log(`   ${endpoint.method} ${endpoint.path} - ${endpoint.description}`, colors.yellow);
      });
    }
    
    if (successful >= total * 0.8) {
      log(`\n🎉 MOONBASE v0 BEDROCK IS SOLID!`, colors.green);
      log(`💪 Your foundation is ready for production workloads!`, colors.green);
    } else if (successful >= total * 0.6) {
      log(`\n👍 MOONBASE v0 BEDROCK IS STABLE`, colors.yellow);
      log(`🔧 Minor issues found, core functionality intact`, colors.yellow);
    } else {
      log(`\n⚠️  BEDROCK NEEDS ATTENTION`, colors.red);
      log(`🔨 Multiple issues found, investigate core systems`, colors.red);
    }
    
    log(`\n💎 v0 is your bedrock - build confidently on these working endpoints!`, colors.cyan);
  }
}

// Run the bedrock test suite
const bedrockSuite = new BedrockTestSuite();
bedrockSuite.runBedrockTests().catch(error => {
  log(`❌ Bedrock test suite failed: ${error.message}`, colors.red);
  process.exit(1);
});
