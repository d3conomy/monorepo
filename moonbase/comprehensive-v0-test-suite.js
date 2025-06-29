#!/usr/bin/env node

/**
 * MOONBASE v0 COMPREHENSIVE TEST SUITE
 * 
 * This is the definitive test suite for all Moonbase v0 API endpoints.
 * It builds on our bedrock foundation and systematically tests every endpoint.
 * 
 * Test Categories:
 * 🗿 BEDROCK - Core working endpoints (our reliable foundation)
 * 🔧 STABLE - Well-tested endpoints that should work consistently
 * ⚡ ADVANCED - Complex endpoints that may have edge cases
 * 🧪 EXPERIMENTAL - New or potentially unstable endpoints
 */

import http from 'http';
import { URL } from 'url';

const BASE_URL = 'http://localhost:4343/api/v0';
const TIMEOUT = 15000;
const SHORT_TIMEOUT = 5000;
const LONG_TIMEOUT = 30000;

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
  dim: '\x1b[2m',
  bright: '\x1b[1m'
};

const categories = {
  BEDROCK: { symbol: '🗿', color: colors.green, name: 'BEDROCK' },
  STABLE: { symbol: '🔧', color: colors.blue, name: 'STABLE' },
  ADVANCED: { symbol: '⚡', color: colors.yellow, name: 'ADVANCED' },
  EXPERIMENTAL: { symbol: '🧪', color: colors.magenta, name: 'EXPERIMENTAL' }
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
          parsedData = body; // Keep as string if not JSON
        }
        
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
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

class ComprehensiveV0TestSuite {
  constructor() {
    this.results = [];
    this.serverHealthy = true;
    this.createdResources = {
      pods: [],
      databases: [],
      filesystems: []
    };
  }

  async healthCheck() {
    try {
      const response = await makeRequest('GET', `${BASE_URL}/ping`, null, SHORT_TIMEOUT);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async test(description, method, path, data = null, options = {}) {
    const {
      expectSuccess = true,
      timeout = TIMEOUT,
      skipIfUnhealthy = true,
      category = 'STABLE',
      skipServerHealthCheck = false
    } = options;

    if (skipIfUnhealthy && !this.serverHealthy) {
      log(`   ⏭️  Skipping: ${description} (server unhealthy)`, colors.yellow);
      return { description, skipped: true, category };
    }

    const url = `${BASE_URL}${path}`;
    const cat = categories[category];
    
    try {
      log(`\n${cat.symbol} ${description}`, cat.color);
      log(`   ${method} ${path}`, colors.dim);
      
      if (data) {
        log(`   📤 ${JSON.stringify(data, null, 2)}`, colors.dim);
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
      this.formatResponse(responseData);
      
      // Check server health after potentially dangerous operations (unless disabled)
      if (!skipServerHealthCheck && (method !== 'GET' || category === 'ADVANCED' || category === 'EXPERIMENTAL')) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause
        const healthy = await this.healthCheck();
        if (!healthy) {
          log(`   🚨 SERVER BECAME UNHEALTHY AFTER THIS OPERATION!`, colors.red);
          this.serverHealthy = false;
        }
      }
      
      const result = {
        description,
        method,
        path,
        data,
        success,
        status,
        duration,
        category,
        response: responseData
      };
      
      this.results.push(result);
      return result;
      
    } catch (error) {
      log(`   ❌ Error: ${error.message}`, colors.red);
      
      // Check if server crashed
      if (!skipServerHealthCheck) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait a bit longer after error
        const healthy = await this.healthCheck();
        if (!healthy) {
          log(`   💥 SERVER CRASHED OR BECAME UNRESPONSIVE!`, colors.red);
          this.serverHealthy = false;
        }
      }
      
      const result = {
        description,
        method,
        path,
        data,
        success: false,
        error: error.message,
        category
      };
      
      this.results.push(result);
      return result;
    }
  }

  formatResponse(responseData) {
    if (typeof responseData === 'string') {
      const preview = responseData.length > 200 ? responseData.substring(0, 200) + '...' : responseData;
      log(`   📄 "${preview}"`, colors.dim);
    } else if (Array.isArray(responseData)) {
      log(`   📄 Array with ${responseData.length} items`, colors.dim);
      if (responseData.length > 0 && responseData.length <= 3) {
        responseData.forEach((item, i) => {
          const preview = typeof item === 'object' ? JSON.stringify(item).substring(0, 100) : item;
          log(`     [${i}]: ${preview}${JSON.stringify(item).length > 100 ? '...' : ''}`, colors.dim);
        });
      }
    } else if (typeof responseData === 'object' && responseData !== null) {
      const keys = Object.keys(responseData);
      log(`   📄 Object with keys: ${keys.join(', ')}`, colors.dim);
      if (keys.length <= 5) {
        Object.entries(responseData).forEach(([key, value]) => {
          const preview = typeof value === 'object' ? JSON.stringify(value).substring(0, 80) : value;
          log(`     ${key}: ${preview}`, colors.dim);
        });
      }
    } else {
      log(`   📄 ${responseData}`, colors.dim);
    }
  }

  async runComprehensiveTests() {
    log(`${colors.bold}🚀 MOONBASE v0 COMPREHENSIVE TEST SUITE${colors.reset}`, colors.cyan);
    log(`${colors.bold}=====================================${colors.reset}`, colors.cyan);
    log(`Testing all available v0 API endpoints systematically...`, colors.white);
    
    // Initial health check
    log(`\n${colors.bold}🏥 INITIAL HEALTH CHECK${colors.reset}`, colors.magenta);
    const healthy = await this.healthCheck();
    if (healthy) {
      log(`✅ Server is healthy and responding`, colors.green);
    } else {
      log(`❌ Server is not responding - aborting tests`, colors.red);
      return;
    }

    // ===========================================
    // 🗿 BEDROCK TESTS - Our reliable foundation
    // ===========================================
    log(`\n${colors.bold}🗿 BEDROCK CATEGORY - RELIABLE FOUNDATION${colors.reset}`, colors.green);
    log(`These endpoints have been proven stable and reliable`, colors.dim);

    // Core monitoring
    await this.test('Ping - Basic connectivity', 'GET', '/ping', null, { category: 'BEDROCK' });
    await this.test('System logbooks', 'GET', '/logbooks', null, { category: 'BEDROCK' });
    await this.test('Recent logs', 'GET', '/logs', null, { category: 'BEDROCK' });

    // Pod system basics
    const podsResult = await this.test('List all pods', 'GET', '/pods', null, { category: 'BEDROCK' });
    
    // Test specific logbook if available
    if (podsResult.success && Array.isArray(podsResult.response)) {
      // Get logbook details
      await this.test('Specific logbook details', 'GET', '/logbooks/default', null, { category: 'BEDROCK' });
    }

    // ===========================================
    // 🔧 STABLE TESTS - Well-tested functionality
    // ===========================================
    log(`\n${colors.bold}🔧 STABLE CATEGORY - WELL-TESTED FUNCTIONALITY${colors.reset}`, colors.blue);
    log(`These endpoints should work consistently under normal conditions`, colors.dim);

    // Test existing pod operations if we have pods
    if (podsResult.success && Array.isArray(podsResult.response) && podsResult.response.length > 0) {
      const firstPod = podsResult.response[0];
      if (firstPod.pod && firstPod.pod.name) {
        const podName = firstPod.pod.name;
        await this.test(`Get pod details - ${podName}`, 'GET', `/pod/${podName}`, null, { category: 'STABLE' });
        await this.test(`Pod status command - ${podName}`, 'POST', `/pod/${podName}`, {
          command: 'status'
        }, { category: 'STABLE' });
      }
    }

    // Filesystem operations
    await this.test('List filesystems', 'GET', '/fs', null, { category: 'STABLE' });
    
    // Database operations
    await this.test('List open databases', 'GET', '/open', null, { category: 'STABLE' });

    // PubSub operations
    await this.test('List PubSub topics', 'GET', '/pubsub/topics', null, { category: 'STABLE' });

    // ===========================================
    // ⚡ ADVANCED TESTS - Complex operations
    // ===========================================
    log(`\n${colors.bold}⚡ ADVANCED CATEGORY - COMPLEX OPERATIONS${colors.reset}`, colors.yellow);
    log(`These endpoints involve more complex operations and may have edge cases`, colors.dim);

    // Safe pod creation test
    const testPodId = `v0-test-${Date.now()}`;
    const createResult = await this.test('Create OrbitDB pod', 'POST', '/pods', {
      id: testPodId,
      process: 'orbitdb'
    }, { category: 'ADVANCED', timeout: LONG_TIMEOUT });

    if (createResult.success) {
      this.createdResources.pods.push(testPodId);
      
      // Test the newly created pod
      await this.test(`Verify created pod - ${testPodId}`, 'GET', `/pod/${testPodId}`, null, { category: 'ADVANCED' });
      
      // Test pod commands
      await this.test(`Pod address command - ${testPodId}`, 'POST', `/pod/${testPodId}`, {
        command: 'address'
      }, { category: 'ADVANCED', timeout: LONG_TIMEOUT });
    }

    // Test different pod types
    const libp2pPodId = `libp2p-test-${Date.now()}`;
    const libp2pResult = await this.test('Create libp2p pod', 'POST', '/pods', {
      id: libp2pPodId,
      process: 'libp2p'
    }, { category: 'ADVANCED', timeout: LONG_TIMEOUT });

    if (libp2pResult.success) {
      this.createdResources.pods.push(libp2pPodId);
      await this.test(`Verify libp2p pod - ${libp2pPodId}`, 'GET', `/pod/${libp2pPodId}`, null, { category: 'ADVANCED' });
    }

    // Database operations
    const testDbName = `test-db-${Date.now()}`;
    await this.test('Create database', 'POST', '/open', {
      databaseName: testDbName,
      databaseType: 'keyvalue'
    }, { category: 'ADVANCED', timeout: LONG_TIMEOUT });

    // ===========================================
    // 🧪 EXPERIMENTAL TESTS - Potentially unstable
    // ===========================================
    log(`\n${colors.bold}🧪 EXPERIMENTAL CATEGORY - BLEEDING EDGE${colors.reset}`, colors.magenta);
    log(`These endpoints are new or potentially unstable - use with caution`, colors.dim);

    // Pod update operations
    if (createResult.success) {
      await this.test(`Update pod - ${testPodId}`, 'PUT', `/pod/${testPodId}`, {
        configuration: { test: true }
      }, { category: 'EXPERIMENTAL', timeout: LONG_TIMEOUT });
    }

    // Filesystem creation
    await this.test('Create filesystem', 'POST', '/fs', {
      type: 'test-fs'
    }, { category: 'EXPERIMENTAL', timeout: LONG_TIMEOUT });

    // Advanced filesystem operations with specific process ID
    await this.test('Advanced filesystem listing', 'GET', '/fs/test-process-id', null, { 
      category: 'EXPERIMENTAL',
      expectSuccess: false // This might fail if process doesn't exist
    });

    // PubSub operations
    await this.test('Subscribe to topic', 'POST', '/pubsub/subscribe', {
      topic: 'test-topic',
      callback: 'http://localhost:4343/callback'
    }, { category: 'EXPERIMENTAL' });

    await this.test('Publish to topic', 'POST', '/pubsub/publish', {
      topic: 'test-topic',
      message: 'Hello from v0 test suite!'
    }, { category: 'EXPERIMENTAL' });

    // Database operations with specific ID
    if (testDbName) {
      await this.test(`Get database info - ${testDbName}`, 'GET', `/db/${testDbName}`, null, { 
        category: 'EXPERIMENTAL' 
      });
      
      await this.test(`Database operation - ${testDbName}`, 'POST', `/db/${testDbName}`, {
        operation: 'put',
        key: 'test-key',
        value: 'test-value'
      }, { category: 'EXPERIMENTAL' });
    }

    // ===========================================
    // 🧹 CLEANUP TESTS - Resource management
    // ===========================================
    log(`\n${colors.bold}🧹 CLEANUP OPERATIONS${colors.reset}`, colors.cyan);
    log(`Cleaning up test resources...`, colors.dim);

    // Clean up created pods
    for (const podId of this.createdResources.pods) {
      await this.test(`Delete pod - ${podId}`, 'DELETE', '/pods', {
        id: podId
      }, { category: 'STABLE', timeout: LONG_TIMEOUT });
    }

    // Clean up databases
    if (testDbName) {
      await this.test(`Delete database - ${testDbName}`, 'DELETE', `/db/${testDbName}`, null, { 
        category: 'STABLE' 
      });
    }

    // Final health check
    log(`\n${colors.bold}🏥 FINAL HEALTH CHECK${colors.reset}`, colors.magenta);
    const finalHealth = await this.healthCheck();
    if (finalHealth) {
      log(`✅ Server survived all comprehensive tests!`, colors.green);
    } else {
      log(`⚠️  Server became unhealthy during testing`, colors.yellow);
    }

    this.printComprehensiveSummary();
  }

  printComprehensiveSummary() {
    log(`\n${colors.bold}📊 COMPREHENSIVE TEST RESULTS${colors.reset}`);
    log(`${'='.repeat(50)}`);

    // Overall stats
    const total = this.results.length;
    const successful = this.results.filter(r => r.success).length;
    const failed = total - successful;
    const skipped = this.results.filter(r => r.skipped).length;

    log(`📈 Total Tests: ${total}`, colors.white);
    log(`✅ Successful: ${successful}/${total} (${((successful/total) * 100).toFixed(1)}%)`, colors.green);
    log(`❌ Failed: ${failed}/${total} (${((failed/total) * 100).toFixed(1)}%)`, colors.red);
    log(`⏭️  Skipped: ${skipped}/${total}`, colors.yellow);

    // Category breakdown
    Object.entries(categories).forEach(([catName, catInfo]) => {
      const catResults = this.results.filter(r => r.category === catName);
      const catSuccessful = catResults.filter(r => r.success).length;
      const catTotal = catResults.length;
      
      if (catTotal > 0) {
        const percentage = ((catSuccessful/catTotal) * 100).toFixed(1);
        log(`${catInfo.symbol} ${catInfo.name}: ${catSuccessful}/${catTotal} (${percentage}%)`, catInfo.color);
      }
    });

    // Server health
    if (this.serverHealthy) {
      log(`🚀 Server Status: HEALTHY`, colors.green);
    } else {
      log(`💥 Server Status: CRASHED/UNHEALTHY`, colors.red);
    }

    // Detailed results by category
    Object.entries(categories).forEach(([catName, catInfo]) => {
      const catResults = this.results.filter(r => r.category === catName);
      if (catResults.length === 0) return;

      log(`\n${colors.bold}${catInfo.symbol} ${catInfo.name} DETAILED RESULTS${colors.reset}`, catInfo.color);
      
      const working = catResults.filter(r => r.success);
      const failing = catResults.filter(r => !r.success && !r.skipped);
      
      if (working.length > 0) {
        log(`✅ Working (${working.length}):`, colors.green);
        working.forEach(test => {
          log(`   ${test.method} ${test.path} - ${test.description}`, colors.green);
        });
      }
      
      if (failing.length > 0) {
        log(`❌ Issues (${failing.length}):`, colors.red);
        failing.forEach(test => {
          log(`   ${test.method} ${test.path} - ${test.description}`, colors.red);
          if (test.error) {
            log(`     Error: ${test.error}`, colors.dim);
          }
        });
      }
    });

    // Overall assessment
    const overallScore = (successful / total) * 100;
    log(`\n${colors.bold}🎯 OVERALL ASSESSMENT${colors.reset}`);
    
    if (overallScore >= 90) {
      log(`🌟 EXCELLENT (${overallScore.toFixed(1)}%): Moonbase v0 is production-ready!`, colors.green);
    } else if (overallScore >= 75) {
      log(`👍 GOOD (${overallScore.toFixed(1)}%): Moonbase v0 is stable with minor issues`, colors.blue);
    } else if (overallScore >= 60) {
      log(`⚠️  FAIR (${overallScore.toFixed(1)}%): Moonbase v0 needs attention`, colors.yellow);
    } else {
      log(`🚨 POOR (${overallScore.toFixed(1)}%): Major issues detected`, colors.red);
    }

    log(`\n💎 Your v0 bedrock endpoints are your reliable foundation - build on them confidently!`, colors.cyan);
    log(`🚀 Use this comprehensive test suite regularly to ensure API reliability!`, colors.cyan);
  }
}

// Run the comprehensive test suite
const comprehensiveSuite = new ComprehensiveV0TestSuite();
comprehensiveSuite.runComprehensiveTests().catch(error => {
  log(`❌ Comprehensive test suite failed: ${error.message}`, colors.red);
  process.exit(1);
});
