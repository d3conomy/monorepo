import { expect } from 'chai';
import { createProcess, Process } from '../src/process-interface/process.js';
import { createProcessCommand, createProcessContainer, createProcessOption, ProcessCommands, ProcessStage, ProcessType } from '../src/process-interface/index.js';
import { JobId, MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from '../src/id-reference-factory/index.js';
const NUM_TESTS = 100;
describe('Process', () => {
    let process;
    beforeEach(async () => {
        // Create a new process instance before each test
        const systemId = new SystemId();
        const moonbaseId = new MoonbaseId({
            systemId
        });
        const podBayId = new PodBayId({
            moonbaseId
        });
        const podId = new PodId({
            podBayId
        });
        const processId = new PodProcessId({
            podId
        });
        const processContainer = createProcessContainer(ProcessType.CUSTOM, {
            process: '() => console.log("Hello, World")'
        });
        const processCommands = new ProcessCommands({
            commands: [
                createProcessCommand({
                    type: ProcessType.CUSTOM,
                    name: 'custom',
                    action: async () => console.log('Hello, World')
                })
            ]
        });
        process = createProcess(processId, processContainer, processCommands);
        // await process.init();
    });
    it('should check if the process is initialized', () => {
        // Test the check() method
        expect(process.check()).to.be.true;
    });
    it('should return the status of the process', () => {
        // Test the status() method
        expect(process.status()).to.equal(ProcessStage.PENDING);
    });
    it('should initialize the process', async () => {
        // Test the init() method
        await process.init();
        // Add assertions here to verify the initialization
        expect(process.check()).to.be.true;
    });
    it('should start the process', async () => {
        // Test the start() method
        await process.start();
        // Add assertions here to verify the start
        expect(process.status()).to.equal(ProcessStage.PENDING);
    });
    it('should stop the process', async () => {
        // Test the stop() method
        await process.stop();
        // Add assertions here to verify the stop
        expect(process.status()).to.equal(ProcessStage.PENDING);
    });
    it('should restart the process', async () => {
        // Test the restart() method
        await process.restart();
        // Add assertions here to verify the restart
    });
    it('should create a process command', () => {
        // Test the createProcessCommand() method
        const command = createProcessCommand({
            name: 'custom',
            action: async () => console.log('Hello, World')
        });
        // Add assertions here to verify the command
        expect(command.name).to.equal('custom');
    });
    it('should create a process container', () => {
        // Test the createProcessContainer() method
        const container = createProcessContainer(ProcessType.CUSTOM, {
            process: '() => console.log("Hello, World")'
        });
        // Add assertions here to verify the container
        expect(container).to.have.property('process');
    });
    it('should create a process', () => {
        // Test the createProcess() method
        const process = createProcess(new PodProcessId({
            podId: new PodId({
                podBayId: new PodBayId({
                    moonbaseId: new MoonbaseId({
                        systemId: new SystemId()
                    })
                })
            })
        }), createProcessContainer(ProcessType.CUSTOM, {
            process: '() => console.log("Hello, World")'
        }), new ProcessCommands({
            commands: [
                createProcessCommand({
                    type: ProcessType.CUSTOM,
                    name: 'custom',
                    action: async () => console.log('Hello, World')
                })
            ]
        }));
        // Add assertions here to verify the process
        expect(process.check()).to.be.true;
        expect(process.status()).to.equal(ProcessStage.PENDING);
        expect(process.jobQueue.isEmpty()).to.be.true;
        expect(process.commands?.has('custom')).to.be.true;
    });
    it('should create a process with options', async () => {
        // Test the createProcess() method with options
        const process = createProcess(new PodProcessId({
            podId: new PodId({
                podBayId: new PodBayId({
                    moonbaseId: new MoonbaseId({
                        systemId: new SystemId()
                    })
                })
            })
        }), createProcessContainer(ProcessType.CUSTOM, () => console.log('Hello, World'), [
            createProcessOption({
                name: 'test',
                value: 'Hello, World'
            })
        ], async (options) => console.log(options)), new ProcessCommands({
            commands: [
                createProcessCommand({
                    type: ProcessType.CUSTOM,
                    name: 'custom',
                    action: async () => console.log('Hello, World')
                })
            ]
        }));
        await process.init();
        // Add assertions here to verify the process
        const jobId = new JobId({
            componentId: process.id
        });
        const job = {
            jobId,
            command: 'custom',
            params: [],
            status: ProcessStage.NEW
        };
        await process.jobQueue.execute(job);
        console.log(process);
        // Add assertions here to verify the process
        expect(process.check()).to.be.true;
        expect(process.status()).to.equal(ProcessStage.PENDING);
        expect(process.jobQueue.isEmpty()).to.be.true;
        expect(process.commands?.has('custom')).to.be.true;
    });
    it('should create a process with a job queue', async () => {
        // Test the createProcess() method with a job queue
        const process = createProcess(new PodProcessId({
            podId: new PodId({
                podBayId: new PodBayId({
                    moonbaseId: new MoonbaseId({
                        systemId: new SystemId()
                    })
                })
            })
        }), createProcessContainer(ProcessType.CUSTOM, () => console.log("Hello, World")), new ProcessCommands({
            commands: [
                createProcessCommand({
                    type: ProcessType.CUSTOM,
                    name: 'custom',
                    action: async () => console.log('Hello, World')
                })
            ]
        }));
        // Add assertions here to verify the process
        expect(process.check()).to.be.true;
        expect(process.status()).to.equal(ProcessStage.PENDING);
        expect(process.jobQueue.isEmpty()).to.be.true;
        for (let i = 0; i < NUM_TESTS; i++) {
            process.jobQueue.enqueue({
                jobId: new JobId({
                    componentId: process.id
                }),
                command: 'custom',
                params: [],
                status: ProcessStage.NEW
            });
        }
        expect(process.jobQueue.size()).to.equal(NUM_TESTS);
        await process.init();
        await process.start();
        expect(process.jobQueue.isEmpty()).to.be.true;
        expect(process.status()).to.equal(ProcessStage.PENDING);
        expect(process.jobQueue.size()).to.equal(0);
        await process.stop();
        expect(process.status()).to.equal(ProcessStage.PENDING);
    });
    describe('ProcessClass', () => {
        const processId = new PodProcessId({
            podId: new PodId({
                podBayId: new PodBayId({
                    moonbaseId: new MoonbaseId({
                        systemId: new SystemId()
                    })
                })
            })
        });
        const processContainer = createProcessContainer(ProcessType.CUSTOM, () => console.log('Hello, World'), [
            createProcessOption({
                name: 'test',
                value: 'Hello, World'
            })
        ], async (options) => console.log(options));
        const processCommands = new ProcessCommands({
            commands: [
                createProcessCommand({
                    type: ProcessType.CUSTOM,
                    name: 'custom',
                    action: async () => console.log('Hello, World')
                })
            ]
        });
        it('should initialize the process', async () => {
            const process = new Process(processId, processContainer, [...processCommands.values()]);
            await process.init();
            expect(process.check()).to.be.true;
            expect(process.status()).to.equal(ProcessStage.PENDING);
            // Add more assertions here to verify the initialization
        });
        it('should start the process', async () => {
            const process = new Process(processId, processContainer, [...processCommands.values()]);
            await process.start();
            expect(process.status()).to.equal(ProcessStage.PENDING);
            // Add more assertions here to verify the starting of the process
        });
        it('should stop the process', async () => {
            const process = new Process(processId, processContainer, [...processCommands.values()]);
            await process.stop();
            expect(process.status()).to.equal(ProcessStage.PENDING);
            // Add more assertions here to verify the stopping of the process
        });
        it('should restart the process', async () => {
            const process = new Process(processId, processContainer, [...processCommands.values()]);
            await process.init();
            for (let i = 0; i < NUM_TESTS; i++) {
                const jobId = new JobId({
                    componentId: process.id
                });
                const job = {
                    jobId,
                    command: 'custom',
                    params: [],
                    status: ProcessStage.NEW
                };
                process.jobQueue.enqueue(job);
            }
            await process.start(false); // .then(() => process.stop());
            expect(process.status()).to.equal(ProcessStage.PENDING);
            expect(process.jobQueue.size()).to.equal(0);
            expect(process.jobQueue.isEmpty()).to.be.true;
            expect(process.commands?.has('custom')).to.be.true;
            expect(process.jobQueue.completed.length).to.equal(NUM_TESTS);
        });
    });
});
