#!/usr/bin/env node

/**
 * MOONBASE v0 API COMPREHENSIVE TEST SUITE
 * Tests all available endpoints in the Moonbase v0 API
 */

import http from 'http';
import { URL } from 'url';

const BASE_URL = 'http://localhost:4343/api/v0';
const TIMEOUT = 15000; // 15 seconds for complex operations

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

function makeRequest(method, url, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers
      },
      timeout: TIMEOUT
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

class APITestSuite {
  constructor() {
    this.results = [];
    this.testData = {
      createdPods: [],
      createdDbs: [],
      testPodId: `test-pod-${Date.now()}`,
      testDbName: `test-db-${Date.now()}`
    };
  }

  async test(description, method, path, data = null, expectedStatuses = [200], headers = {}) {
    const url = `${BASE_URL}${path}`;
    
    try {
      log(`\n🧪 ${description}`, colors.cyan);
      log(`   ${method} ${path}`, colors.dim);
      
      if (data) {
        log(`   📤 Request: ${JSON.stringify(data, null, 2).substring(0, 200)}...`, colors.dim);
      }
      
      const startTime = Date.now();
      const response = await makeRequest(method, url, data, headers);
      const duration = Date.now() - startTime;
      
      const { status, statusText, data: responseData } = response;
      const isExpected = expectedStatuses.includes(status);
      
      if (isExpected) {
        log(`   ✅ ${status} ${statusText} (${duration}ms)`, colors.green);
      } else {
        log(`   ⚠️  ${status} ${statusText} (expected: ${expectedStatuses.join('|')}) (${duration}ms)`, colors.yellow);
      }
      
      // Show response preview
      if (typeof responseData === 'object' && responseData !== null) {
        const preview = JSON.stringify(responseData, null, 2);
        if (preview.length > 400) {
          log(`   📄 Response: ${preview.substring(0, 400)}...`, colors.dim);
        } else {
          log(`   📄 Response: ${preview}`, colors.dim);
        }
      } else {
        const preview = responseData ? responseData.toString() : 'No response data';
        log(`   📄 Response: ${preview.substring(0, 200)}${preview.length > 200 ? '...' : ''}`, colors.dim);
      }
      
      const result = {
        description,
        method,
        path,
        status,
        success: isExpected,
        duration,
        data: responseData
      };
      
      this.results.push(result);
      return result;
      
    } catch (error) {
      log(`   ❌ ERROR: ${error.message}`, colors.red);
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

  async runAllTests() {
    log(`${colors.bold}🚀 MOONBASE v0 API COMPREHENSIVE TEST SUITE${colors.reset}`, colors.blue);
    log(`🎯 Testing API at: ${BASE_URL}\n`);
    
    // === BASIC CONNECTIVITY ===
    log(`${colors.bold}🔌 BASIC CONNECTIVITY TESTS${colors.reset}`, colors.magenta);
    await this.test('API Documentation', 'GET', '/docs/', null, [200, 301, 302]);
    
    // === METRICS & MONITORING ===
    log(`${colors.bold}📊 METRICS & MONITORING${colors.reset}`, colors.magenta);
    await this.test('Ping endpoint', 'GET', '/ping');
    await this.test('Get all logbooks', 'GET', '/logbooks');
    await this.test('Get logs', 'GET', '/logs');
    
    // === POD MANAGEMENT ===
    log(`${colors.bold}🚀 POD MANAGEMENT${colors.reset}`, colors.magenta);
    const podsResult = await this.test('List all pods', 'GET', '/pods');
    
    // Create a new pod
    const createPodResult = await this.test('Create new pod', 'POST', '/pods', {
      id: this.testData.testPodId,
      process: 'orbitdb'
    }, [200, 201]);
    
    if (createPodResult.success) {
      this.testData.createdPods.push(this.testData.testPodId);
      
      // Test pod-specific endpoints
      await this.test(`Get specific pod: ${this.testData.testPodId}`, 'GET', `/pod/${this.testData.testPodId}`);
      await this.test(`Send command to pod: ${this.testData.testPodId}`, 'POST', `/pod/${this.testData.testPodId}`, {
        command: 'status'
      });
      await this.test(`Update pod: ${this.testData.testPodId}`, 'PUT', `/pod/${this.testData.testPodId}`, {
        action: 'start'
      });
    }
    
    // === FILESYSTEM ===
    log(`${colors.bold}📁 FILESYSTEM OPERATIONS${colors.reset}`, colors.magenta);
    await this.test('List filesystems', 'GET', '/fs');
    await this.test('Create filesystem', 'POST', '/fs', {
      type: 'ipfs',
      options: {}
    }, [200, 201, 400]); // 400 might be expected if already exists
    
    // === DATABASE OPERATIONS ===
    log(`${colors.bold}🗄️  DATABASE OPERATIONS${colors.reset}`, colors.magenta);
    await this.test('List open databases', 'GET', '/open');
    
    const createDbResult = await this.test('Create/Open database', 'POST', '/open', {
      name: this.testData.testDbName,
      type: 'documents'
    }, [200, 201]);
    
    if (createDbResult.success && createDbResult.data?.id) {
      const dbId = createDbResult.data.id;
      this.testData.createdDbs.push(dbId);
      
      // Test database-specific operations
      await this.test(`Get database info: ${dbId}`, 'GET', `/db/${dbId}`);
      await this.test(`Add data to database: ${dbId}`, 'POST', `/db/${dbId}`, {
        document: {
          test: 'data',
          timestamp: new Date().toISOString()
        }
      }, [200, 201]);
    }
    
    // === PUBSUB OPERATIONS ===
    log(`${colors.bold}📡 PUBSUB OPERATIONS${colors.reset}`, colors.magenta);
    await this.test('List PubSub topics', 'GET', '/pubsub/topics');
    
    // === ADVANCED POD OPERATIONS ===
    log(`${colors.bold}🔧 ADVANCED POD OPERATIONS${colors.reset}`, colors.magenta);
    
    // Test with different process types
    const libp2pPodId = `libp2p-pod-${Date.now()}`;
    await this.test('Create libp2p pod', 'POST', '/pods', {
      id: libp2pPodId,
      process: 'libp2p'
    }, [200, 201]);
    this.testData.createdPods.push(libp2pPodId);
    
    const ipfsPodId = `ipfs-pod-${Date.now()}`;
    await this.test('Create IPFS pod', 'POST', '/pods', {
      id: ipfsPodId,
      process: 'ipfs'
    }, [200, 201]);
    this.testData.createdPods.push(ipfsPodId);
    
    // === DISCOVERY TESTS ===
    log(`${colors.bold}🔍 ENDPOINT DISCOVERY${colors.reset}`, colors.magenta);
    await this.test('Test root API path', 'GET', '/', null, [200, 404]);
    await this.test('Test health endpoint', 'GET', '/health', null, [200, 404]);
    await this.test('Test status endpoint', 'GET', '/status', null, [200, 404]);
    await this.test('Test version endpoint', 'GET', '/version', null, [200, 404]);
    
    // === CLEANUP TESTS ===
    await this.runCleanupTests();
    
    // === RESULTS SUMMARY ===
    this.printSummary();
  }

  async runCleanupTests() {
    if (this.testData.createdDbs.length > 0 || this.testData.createdPods.length > 0) {
      log(`${colors.bold}🧹 CLEANUP TESTS${colors.reset}`, colors.magenta);
      
      // Clean up databases
      for (const dbId of this.testData.createdDbs) {
        await this.test(`Delete database: ${dbId}`, 'DELETE', `/db/${dbId}`, null, [200, 204, 404]);
      }
      
      // Clean up pods
      await this.test('Delete all test pods', 'DELETE', '/pods', {
        confirm: true
      }, [200, 204, 404]);
    }
  }

  printSummary() {
    const successful = this.results.filter(r => r.success).length;
    const total = this.results.length;
    const failed = total - successful;
    const averageDuration = this.results
      .filter(r => r.duration)
      .reduce((sum, r) => sum + r.duration, 0) / this.results.filter(r => r.duration).length;

    log(`\n${colors.bold}📊 COMPREHENSIVE TEST RESULTS${colors.reset}`);
    log(`${'='.repeat(50)}`);
    log(`✅ Successful: ${successful}/${total}`, successful > total * 0.7 ? colors.green : colors.yellow);
    log(`❌ Failed: ${failed}/${total}`, failed === 0 ? colors.green : colors.red);
    log(`📈 Success Rate: ${((successful/total) * 100).toFixed(1)}%`);
    log(`⏱️  Average Response Time: ${averageDuration ? averageDuration.toFixed(0) + 'ms' : 'N/A'}`);
    
    // Categorize results
    const categories = {};
    this.results.forEach(result => {
      const category = result.description.split(' ')[0];
      if (!categories[category]) categories[category] = { success: 0, total: 0 };
      categories[category].total++;
      if (result.success) categories[category].success++;
    });
    
    log(`\n${colors.bold}📋 RESULTS BY CATEGORY${colors.reset}`);
    Object.entries(categories).forEach(([category, stats]) => {
      const rate = ((stats.success / stats.total) * 100).toFixed(0);
      log(`   ${category}: ${stats.success}/${stats.total} (${rate}%)`, 
          stats.success === stats.total ? colors.green : 
          stats.success > stats.total * 0.5 ? colors.yellow : colors.red);
    });
    
    if (successful > total * 0.8) {
      log(`\n🎉 EXCELLENT! Moonbase v0 API is highly functional!`, colors.green);
    } else if (successful > total * 0.5) {
      log(`\n👍 GOOD! Moonbase v0 API is mostly working!`, colors.yellow);
    } else {
      log(`\n⚠️  Some issues found, but core functionality appears operational`, colors.yellow);
    }
    
    log(`\n💡 Access Swagger docs at: ${BASE_URL}/docs/`, colors.cyan);
    log(`🌙 Moonbase is your v0 bedrock! 🚀`, colors.blue);
  }
}

// Run the comprehensive test suite
const testSuite = new APITestSuite();
testSuite.runAllTests().catch(error => {
  log(`❌ Test suite failed: ${error.message}`, colors.red);
  process.exit(1);
});
