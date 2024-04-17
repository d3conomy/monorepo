import { expect } from 'chai';
import { JobQueue } from '../src/process-interface/processJobQueue.js';
import { ProcessCommands, createProcessCommand } from '../src/process-interface/processCommand.js';
import { createProcessContainer } from '../src/process-interface/processContainer.js';
import { JobId, SystemId } from '../src/id-reference-factory/index.js';
describe('JobQueue', () => {
    let jobQueue;
    let processCommands;
    let processContainer;
    beforeEach(() => {
        jobQueue = new JobQueue();
        // processCommands = {} as IProcessCommands;
        // processContainer = {} as IProcessContainer;
    });
    it('should enqueue a job', () => {
        const job = {};
        jobQueue.enqueue(job);
        expect(jobQueue.size()).to.equal(1);
    });
    it('should dequeue a job', () => {
        const job = {};
        jobQueue.enqueue(job);
        const dequeuedJob = jobQueue.dequeue();
        expect(dequeuedJob).to.equal(job);
        expect(jobQueue.size()).to.equal(0);
    });
    it('should check if the queue is empty', () => {
        expect(jobQueue.isEmpty()).to.be.true;
        const job = {};
        jobQueue.enqueue(job);
        expect(jobQueue.isEmpty()).to.be.false;
    });
    it('should return the size of the queue', () => {
        expect(jobQueue.size()).to.equal(0);
        const job = {};
        jobQueue.enqueue(job);
        expect(jobQueue.size()).to.equal(1);
    });
    it('should run the jobs in the queue', async () => {
        const systemId = new SystemId();
        const jobId = new JobId({ componentId: systemId });
        const job = {
            jobId,
            command: 'test',
            params: [],
            status: 'initializing'
        };
        const processCommand = createProcessCommand({ name: 'test', action: () => { return "test"; } });
        const processContainer = createProcessContainer('test', () => { return "test"; });
        let processCommands = new ProcessCommands({
            commands: [processCommand],
            proc: processContainer
        });
        const jobQueue = new JobQueue();
        await jobQueue.init(processCommands);
        jobQueue.enqueue(job);
        console.log(jobQueue.size());
        await jobQueue.run();
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        // jobQueue.stop();
        console.log(jobQueue.completed);
        expect(jobQueue.completed.length).to.equal(1);
    });
    it('should stop the job queue', () => {
        jobQueue.stop();
        expect(jobQueue.running).to.be.undefined;
        // expect(jobQueue.stopFlag).to.be.true;
    });
    it('should initialize the job queue', async () => {
        const processCommands = {};
        jobQueue.init(processCommands);
        // expect(jobQueue.stopFlag).to.be.false;
        // expect(jobQueue.processCommands).to.equal(processCommands);
        expect(jobQueue.running).to.be.undefined;
    });
    it('should addrun 100 processes to the queue', async () => {
        let processCommandsList = [];
        processCommandsList.push(createProcessCommand({ name: 'test', action: () => { return "test"; } }));
        const processContainer = createProcessContainer('test', () => { return "test"; });
        let processCommands = new ProcessCommands({
            commands: [...processCommandsList],
            proc: processContainer
        });
        jobQueue.init(processCommands);
        for (let i = 0; i < 10000; i++) {
            const systemId = new SystemId();
            const jobId = new JobId({ componentId: systemId });
            const job = {
                jobId,
                command: 'test',
                params: [],
                status: 'initializing'
            };
            jobQueue.enqueue(job);
            // const processCommand = createProcessCommand({ name: 'test', action: () => { return "test" }});
            // processCommandsList.push(processCommand);
        }
        const startTime = new Date();
        await jobQueue.run();
        const endTime = new Date();
        console.log(`Sequential run time: ${endTime.getTime() - startTime.getTime()}ms`);
        jobQueue.stop();
        expect(jobQueue.completed.length).to.equal(10000);
    });
    it('should run 100 processes in parallel', async () => {
        let processCommandsList = [];
        processCommandsList.push(createProcessCommand({ name: 'test', action: () => { return "test"; } }));
        const processContainer = createProcessContainer('test', () => { return "test"; });
        let processCommands = new ProcessCommands({
            commands: [...processCommandsList],
            proc: processContainer
        });
        jobQueue.init(processCommands);
        for (let i = 0; i < 10000; i++) {
            const systemId = new SystemId();
            const jobId = new JobId({ componentId: systemId });
            const job = {
                jobId,
                command: 'test',
                params: [],
                status: 'initializing'
            };
            jobQueue.enqueue(job);
            // const processCommand = createProcessCommand({ name: 'test', action: () => { return "test" }});
            // processCommandsList.push(processCommand);
        }
        const startTime = new Date();
        await jobQueue.runParallel();
        const endTime = new Date();
        console.log(`Parallel run time: ${endTime.getTime() - startTime.getTime()}ms`);
        jobQueue.stop();
        expect(jobQueue.completed.length).to.equal(10000);
    });
});
