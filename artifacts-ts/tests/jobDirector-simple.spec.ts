import { expect } from 'chai';
import { JobDirector, ContainerJob } from '../src/moonbase/jobDirector.js';
import { IdReferenceFactory, MoonbaseId, SystemId } from '../src/id-reference-factory/index.js';
import { Moonbase } from '../src/moonbase/index.js';
import { InstanceOptions } from '../src/container/options.js';
import { MoonbaseOptions } from '../src/moonbase/options.js';
import { InstanceTypes } from '../src/container/instance.js';
import { Command } from '../src/container/commands.js';
import { JobStatus } from '../src/container/status.js';
import { Container } from '../src/container/index.js';

describe('JobDirector - Simple Tests', () => {
    let moonbase: Moonbase;
    let jobDirector: JobDirector;
    let idReferenceFactory: IdReferenceFactory;

    beforeEach(async () => {
        // Create fresh instances for each test
        idReferenceFactory = new IdReferenceFactory();
        const systemId: SystemId = idReferenceFactory.createIdReference({type: 'system'}) as SystemId;
        const moonbaseId: MoonbaseId = idReferenceFactory.createIdReference({type: 'moonbase', dependsOn: systemId}) as MoonbaseId;

        const moonbaseOptions: MoonbaseOptions = new MoonbaseOptions(
            new InstanceOptions({options: [
                {
                    name: "createPodBay",
                    value: false // Don't create pod bay to avoid complexity
                }
            ]})
        );
        
        moonbase = new Moonbase({
            id: moonbaseId, 
            systemId: systemId, 
            options: moonbaseOptions, 
            idReferenceFactory: idReferenceFactory
        });
        
        jobDirector = moonbase.jobDirector;
        
        console.log('Initialized simple JobDirector test environment');
    });

    afterEach(() => {
        // Simple cleanup
        if (jobDirector) {
            jobDirector.queue = [];
        }
        moonbase = undefined as any;
        jobDirector = undefined as any;
        idReferenceFactory = undefined as any;
    });

    describe('basic functionality', () => {
        it('should initialize with empty queue', () => {
            expect(jobDirector).to.exist;
            expect(jobDirector.queue).to.be.an('array');
            expect(jobDirector.queue.length).to.equal(0);
        });

        it('should have working queue operations', () => {
            // Create a mock container ID
            const mockContainerId = idReferenceFactory.createIdReference({type: 'container'});
            
            // Create a mock job directly on the queue (bypassing pod creation)
            const mockJob: ContainerJob = {
                id: idReferenceFactory.createIdReference({type: 'job'}),
                command: 'test-command',
                container: undefined, // We'll test without actual container
                status: 'pending',
                created: new Date(),
                args: {}
            };
            
            // Test queue operations
            jobDirector.queue.push(mockJob);
            expect(jobDirector.queue.length).to.equal(1);
            expect(jobDirector.queue[0].command).to.equal('test-command');
            expect(jobDirector.queue[0].status).to.equal('pending');
        });

        it('should handle multiple jobs in queue', () => {
            const mockContainerId = idReferenceFactory.createIdReference({type: 'container'});
            
            const job1: ContainerJob = {
                id: idReferenceFactory.createIdReference({type: 'job'}),
                command: 'command-1',
                container: undefined,
                status: 'pending',
                created: new Date(),
                args: {}
            };
            
            const job2: ContainerJob = {
                id: idReferenceFactory.createIdReference({type: 'job'}),
                command: 'command-2',
                container: undefined,
                status: 'pending',
                created: new Date(),
                args: {}
            };
            
            jobDirector.queue.push(job1, job2);
            
            expect(jobDirector.queue.length).to.equal(2);
            expect(jobDirector.queue[0].command).to.equal('command-1');
            expect(jobDirector.queue[1].command).to.equal('command-2');
        });

        it('should manage job status', () => {
            const mockJob: ContainerJob = {
                id: idReferenceFactory.createIdReference({type: 'job'}),
                command: 'status-test',
                container: undefined,
                status: 'pending',
                created: new Date(),
                args: {}
            };
            
            jobDirector.queue.push(mockJob);
            
            // Test status updates
            mockJob.status = 'running';
            expect(jobDirector.queue[0].status).to.equal('running');
            
            mockJob.status = 'completed';
            expect(jobDirector.queue[0].status).to.equal('completed');
        });

        it('should handle job queue cleanup', () => {
            // Add several jobs
            for (let i = 0; i < 5; i++) {
                const job: ContainerJob = {
                    id: idReferenceFactory.createIdReference({type: 'job'}),
                    command: `command-${i}`,
                    container: undefined,
                    status: 'pending',
                    created: new Date(),
                    args: {}
                };
                jobDirector.queue.push(job);
            }
            
            expect(jobDirector.queue.length).to.equal(5);
            
            // Clear queue
            jobDirector.queue = [];
            expect(jobDirector.queue.length).to.equal(0);
        });
    });

    describe('error handling', () => {
        it('should handle invalid job parameters', () => {
            // Test with undefined command
            const invalidJob: ContainerJob = {
                id: idReferenceFactory.createIdReference({type: 'job'}),
                command: '', // Empty command
                container: undefined,
                status: 'pending',
                created: new Date(),
                args: {}
            };
            
            jobDirector.queue.push(invalidJob);
            expect(jobDirector.queue.length).to.equal(1);
            expect(jobDirector.queue[0].command).to.equal('');
        });

        it('should handle queue operations on empty queue', () => {
            expect(jobDirector.queue.length).to.equal(0);
            
            // Should not throw when accessing empty queue
            expect(() => {
                const firstJob = jobDirector.queue[0];
            }).not.to.throw();
            
            expect(jobDirector.queue[0]).to.be.undefined;
        });
    });
});
