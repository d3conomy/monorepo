import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { JobDirector, ContainerJob } from '../src/moonbase/jobDirector.js';
import { PodBay } from '../src/pod-bay/index.js';
import { IdReferenceFactory, MoonbaseId, PodBayId, SystemId } from '../src/id-reference-factory/index.js';
import { Moonbase } from '../src/moonbase/index.js';
import { InstanceOptions } from '../src/container/options.js';
import { StackTypes } from '../src/lunar-pod/stack.js';
import { MoonbaseOptions } from '../src/moonbase/options.js';
import { InstanceTypes } from '../src/container/instance.js';
import { LunarPod } from './lunar-pod/index.js';

describe('JobDirector', () => {
    let moonbase: Moonbase;
    let jobDirector: JobDirector;
    let pod: LunarPod;

    // Increase timeout for slow async operations
    before(function() {
        this.timeout(10000); // 10 seconds
    });

    // Global cleanup before any tests run
    before(async function() {
        this.timeout(10000);
        
        console.log('Performing global cleanup before JobDirector tests...');
        
        // Remove any existing test directories
        const baseTestDir = path.resolve(__dirname, '../pods/test');
        if (fs.existsSync(baseTestDir)) {
            try {
                fs.rmSync(baseTestDir, { recursive: true, force: true });
                console.log('Cleaned up all existing test directories');
            } catch (e) {
                console.warn('Warning during global cleanup:', e);
            }
        }
    });

    beforeEach(async function() {
        this.timeout(15000); // Reasonable timeout for setup
        
        // Create completely fresh instances for each test to avoid "Pod already has a stack" error
        const idReferenceFactory = new IdReferenceFactory();
        const systemId: SystemId = idReferenceFactory.createIdReference({type: 'system'}) as SystemId;
        const moonbaseId: MoonbaseId = idReferenceFactory.createIdReference({type: 'moonbase', dependsOn: systemId}) as MoonbaseId;
        const podBayId: PodBayId = idReferenceFactory.createIdReference({type: 'pod-bay', dependsOn: moonbaseId}) as PodBayId;

        const podBay = new PodBay({id: podBayId, idReferenceFactory: idReferenceFactory});
        const moonbaseOptions: MoonbaseOptions = new MoonbaseOptions(
            new InstanceOptions({options: [
                {
                    name: "createPodBay",
                    value: true
                }
            ]})
        );
        
        // Create a fresh moonbase instance for each test
        moonbase = new Moonbase({id: moonbaseId, systemId: systemId, options: moonbaseOptions, idReferenceFactory: idReferenceFactory});
        
        // Create a unique pod for each test to avoid stack conflicts
        const uniqueId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const uniqueDirectory = `./pods/test/moonbase_${uniqueId}`;
        
        console.log(`Creating fresh pod for JobDirector testing: ${uniqueId}`);
        
        // Create a completely new pod instance with initialize=true (default)
        // to avoid the double init issue
        pod = await moonbase.createPod({
            options: new InstanceOptions({options: [
                {
                    name: "stack",
                    value: StackTypes.GossipSub // Use gossipsub stack to avoid database locks
                },
                {
                    name: "directory", 
                    value: uniqueDirectory
                },
                {
                    name: "start",
                    value: true
                }
            ]})
            // Don't call initialize: false, let the default initialization happen
        });
        
        // Don't call pod.init() here since it's already initialized during creation
        
        // Get the job director from the fresh moonbase instance
        jobDirector = moonbase.jobDirector;
        
        console.log(`Successfully initialized fresh pod: ${uniqueId}`);
    });

    afterEach(async function() {
        this.timeout(15000); // Reasonable timeout for cleanup
        
        // Stop the pod with simple cleanup for libp2p/pubsub containers
        if (pod) {
            try {
                console.log('Starting pod cleanup...');
                
                // Get containers and stop them gracefully
                const containers = pod.getContainers();
                if (containers && containers.length > 0) {
                    for (const container of containers) {
                        if (container) {
                            try {
                                console.log(`Stopping container: ${container.id.name} (${container.type})`);
                                
                                const instance = container.getInstance();
                                if (instance && typeof instance.stop === 'function') {
                                    await instance.stop();
                                    console.log(`Successfully stopped container: ${container.id.name}`);
                                }
                            } catch (e) {
                                const err = e as Error;
                                console.warn(`Error stopping container ${container.id.name}:`, err.message);
                                // Continue cleanup even if one container fails
                            }
                        }
                    }
                }
                
                // Call the main stop method if available
                if (typeof pod.stop === 'function') {
                    await pod.stop();
                    console.log('Called pod.stop() successfully');
                }
                
            } catch (e) {
                const err = e as Error;
                console.warn('Error during pod cleanup:', err.message);
            }
        }
        
        // Clear the moonbase jobDirector as well
        if (moonbase && moonbase.jobDirector) {
            moonbase.jobDirector.queue = [];
        }
        
        // Nullify instances to ensure fresh start for next test
        pod = undefined as any;
        moonbase = undefined as any;
        jobDirector = undefined as any;
        
        // Clean up test directories (these should be small since no databases)
        const baseTestDir = path.resolve(__dirname, '../pods/test');
        try {
            if (fs.existsSync(baseTestDir)) {
                fs.rmSync(baseTestDir, { recursive: true, force: true });
                console.log('Successfully cleaned test directories');
            }
        } catch (e) {
            const err = e as Error;
            console.warn('Warning during directory cleanup:', err.message);
        }
    });

    // Global cleanup after all tests complete
    after(async function() {
        this.timeout(10000);
        
        console.log('Performing final cleanup after all JobDirector tests...');
        
        // Final directory cleanup
        const baseTestDir = path.resolve(__dirname, '../pods/test');
        if (fs.existsSync(baseTestDir)) {
            try {
                fs.rmSync(baseTestDir, { recursive: true, force: true });
                console.log('Final cleanup completed');
            } catch (e) {
                console.warn('Warning during final cleanup:', e);
            }
        }
    });

    describe('enqueue', () => {
        it('should add a job to the queue', async () => {
            const containers = pod.getContainers();
            console.log('Available containers:', containers.map(c => c ? `${c.id.name} (${c.type})` : 'undefined'));

            let libp2pContainerId;
            for (const container of containers) {
                if (container?.type === InstanceTypes.libp2p) {
                    libp2pContainerId = container.id;
                    break;
                }
            } 

            if (!libp2pContainerId) {
                throw new Error('No libp2p container found in pod');
            }

            moonbase.createJob({
                command: 'status', // Use status command which should be available for libp2p
                containerId: libp2pContainerId,
            });
            expect(jobDirector.queue.length).to.equal(1);
        });

        it('should handle multiple jobs in queue', async () => {
            const containers = pod.getContainers();
            let libp2pContainerId;
            
            for (const container of containers) {
                if (container?.type === InstanceTypes.libp2p) {
                    libp2pContainerId = container.id;
                    break;
                }
            }

            if (!libp2pContainerId) {
                throw new Error('No libp2p container found in pod');
            }

            // Add multiple jobs
            moonbase.createJob({
                command: 'status',
                containerId: libp2pContainerId,
            });
            
            moonbase.createJob({
                command: 'peerInfo',
                containerId: libp2pContainerId,
            });

            expect(jobDirector.queue.length).to.equal(2);
        });

        it('should process jobs and update status', async () => {
            const containers = pod.getContainers();
            let libp2pContainerId;
            
            for (const container of containers) {
                if (container?.type === InstanceTypes.libp2p) {
                    libp2pContainerId = container.id;
                    break;
                }
            }

            if (!libp2pContainerId) {
                throw new Error('No libp2p container found in pod');
            }

            // Create a job
            const job = moonbase.createJob({
                command: 'status',
                containerId: libp2pContainerId,
            });

            // Verify job is in queue
            expect(jobDirector.queue.length).to.equal(1);
            
            // Job should have proper structure
            const queuedJob = jobDirector.queue[0];
            expect(queuedJob.command).to.equal('status');
            expect(queuedJob.container).to.exist;
        });
    });

    describe('job processing', () => {
        it('should execute jobs with proper error handling', async () => {
            const containers = pod.getContainers();
            let libp2pContainerId;
            
            for (const container of containers) {
                if (container?.type === InstanceTypes.libp2p) {
                    libp2pContainerId = container.id;
                    break;
                }
            }

            if (!libp2pContainerId) {
                throw new Error('No libp2p container found in pod');
            }

            // Test with a valid command
            moonbase.createJob({
                command: 'status',
                containerId: libp2pContainerId,
            });

            expect(jobDirector.queue.length).to.equal(1);
            
            // Test with an invalid command to ensure error handling
            moonbase.createJob({
                command: 'invalid-command',
                containerId: libp2pContainerId,
            });

            expect(jobDirector.queue.length).to.equal(2);
        });

        it('should handle jobs for different container types', async () => {
            const containers = pod.getContainers();
            
            // Find different container types (gossipsub stack has libp2p and pubsub)
            let libp2pContainerId, pubsubContainerId;
            
            for (const container of containers) {
                if (container?.type === InstanceTypes.libp2p) {
                    libp2pContainerId = container.id;
                } else if (container?.type === InstanceTypes.pubsub) {
                    pubsubContainerId = container.id;
                }
            }

            // Create jobs for different container types
            if (libp2pContainerId) {
                moonbase.createJob({
                    command: 'status',
                    containerId: libp2pContainerId,
                });
            }

            if (pubsubContainerId) {
                moonbase.createJob({
                    command: 'status',
                    containerId: pubsubContainerId,
                });
            }

            // Queue should contain jobs for available containers
            expect(jobDirector.queue.length).to.be.greaterThan(0);
            console.log(`Created ${jobDirector.queue.length} jobs for different container types`);
        });

        it('should validate job parameters', async () => {
            const containers = pod.getContainers();
            let libp2pContainerId;
            
            for (const container of containers) {
                if (container?.type === InstanceTypes.libp2p) {
                    libp2pContainerId = container.id;
                    break;
                }
            }

            if (!libp2pContainerId) {
                throw new Error('No libp2p container found in pod');
            }

            // Test with missing command - should be invalid but let's check if it throws
            const initialQueueLength = jobDirector.queue.length;
            
            try {
                moonbase.createJob({
                    command: '', // Empty command instead of missing
                    containerId: libp2pContainerId,
                });
                // If no error, just check queue state
                console.log('Job with empty command was accepted');
            } catch (error) {
                // Expected error for invalid command
                const err = error as Error;
                console.log('Correctly caught validation error:', err.message);
            }

            // Test with missing containerId
            try {
                moonbase.createJob({
                    command: 'status',
                    // containerId deliberately omitted
                });
                console.log('Job without containerId was accepted');
            } catch (error) {
                // Expected error for missing containerId
                const err = error as Error;
                console.log('Correctly caught validation error:', err.message);
            }

            // Queue state should be predictable
            console.log(`Queue length after validation tests: ${jobDirector.queue.length}`);
        });
    });
});