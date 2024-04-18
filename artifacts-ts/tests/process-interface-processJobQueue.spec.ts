import { expect } from 'chai';
import { JobQueue } from '../src/process-interface/processJobQueue.js';
import { IProcessCommands, ProcessCommands, createProcessCommand } from '../src/process-interface/processCommand.js';
import { IProcessContainer, createProcessContainer } from '../src/process-interface/processContainer.js';
import { IProcessJob, runCommand } from '../src/process-interface/processJob.js';
import { JobId, SystemId } from '../src/id-reference-factory/index.js';

describe('JobQueue', () => {
    let jobQueue: JobQueue;
    let processCommands: IProcessCommands;
    let processContainer: IProcessContainer;

    beforeEach(() => {
        jobQueue = new JobQueue();
        // processCommands = {} as IProcessCommands;
        // processContainer = {} as IProcessContainer;
    });

    it('should enqueue a job', () => {
        const job: IProcessJob = {} as IProcessJob;
        jobQueue.enqueue(job);
        expect(jobQueue.size()).to.equal(1);
    });

    it('should dequeue a job', () => {
        const job: IProcessJob = {} as IProcessJob;
        jobQueue.enqueue(job);
        const dequeuedJob = jobQueue.dequeue();
        expect(dequeuedJob).to.equal(job);
        expect(jobQueue.size()).to.equal(0);
    });

    it('should check if the queue is empty', () => {
        expect(jobQueue.isEmpty()).to.be.true;
        const job: IProcessJob = {} as IProcessJob;
        jobQueue.enqueue(job);
        expect(jobQueue.isEmpty()).to.be.false;
    });

    it('should return the size of the queue', () => {
        expect(jobQueue.size()).to.equal(0);
        const job: IProcessJob = {} as IProcessJob;
        jobQueue.enqueue(job);
        expect(jobQueue.size()).to.equal(1);
    });

    it('should run the jobs in the queue', async () => {
        const systemId = new SystemId();
        const jobId = new JobId({componentId: systemId});
        const job: IProcessJob = {
            jobId,
            command: 'test',
            params: [],
            status: 'initializing'
        } as IProcessJob;

        const processCommand = createProcessCommand({ name: 'test', action: () => { return "test" }});

        const processContainer = createProcessContainer('test', () => { return "test" });


        let processCommands = new ProcessCommands({
            commands: [processCommand],
            proc: processContainer
        });

        const jobQueue = new JobQueue();
        await jobQueue.init(processCommands);
        jobQueue.enqueue(job);
        console.log(jobQueue.size())
        await jobQueue.run();

        // await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // jobQueue.stop();
        console.log(jobQueue.completed)

        expect (jobQueue.completed.length).to.equal(1);
    });

    it('should stop the job queue', () => {
        jobQueue.stop();
        expect(jobQueue.running).to.be.undefined;
        // expect(jobQueue.stopFlag).to.be.true;
    });

    it('should initialize the job queue', async () => {
        const processCommands = {} as IProcessCommands;
        jobQueue.init(processCommands);
        // expect(jobQueue.stopFlag).to.be.false;
        // expect(jobQueue.processCommands).to.equal(processCommands);
        expect(jobQueue.running).to.be.undefined;
    });

    it('should addrun 100 processes to the queue', async function () {
        this.timeout(0);
        let processCommandsList = [];
        processCommandsList.push(createProcessCommand({ name: 'test', action: () => { return "test" }}));
        const processContainer = createProcessContainer('test', () => { return "test" });

        let processCommands = new ProcessCommands({
            commands: [...processCommandsList],
            proc: processContainer
        });

        jobQueue.init(processCommands);

        for (let i = 0; i < 100000; i++) {
            const systemId = new SystemId();
            const jobId = new JobId({componentId: systemId});
            const job: IProcessJob = {
                jobId,
                command: 'test',
                params: [],
                status: 'initializing'
            } as IProcessJob;
            jobQueue.enqueue(job);
            // const processCommand = createProcessCommand({ name: 'test', action: () => { return "test" }});
            // processCommandsList.push(processCommand);
        }
        const startTime = new Date();
        await jobQueue.run();
        const endTime = new Date();

        console.log(`Sequential run time: ${endTime.getTime() - startTime.getTime()}ms`);
        jobQueue.stop();
        expect(jobQueue.completed.length).to.equal(100000);
    });

    it('should run 100 processes in parallel', async function () {
        this.timeout(0);
        let processCommandsList = [];
        processCommandsList.push(createProcessCommand({ name: 'test', action: () => { return "test" }}));
        const processContainer = createProcessContainer('test', () => { return "test" });

        let processCommands = new ProcessCommands({
            commands: [...processCommandsList],
            proc: processContainer
        });

        jobQueue.init(processCommands);

        for (let i = 0; i < 100000; i++) {
            const systemId = new SystemId();
            const jobId = new JobId({componentId: systemId});
            const job: IProcessJob = {
                jobId,
                command: 'test',
                params: [],
                status: 'initializing'
            } as IProcessJob;
            jobQueue.enqueue(job);
            // const processCommand = createProcessCommand({ name: 'test', action: () => { return "test" }});
            // processCommandsList.push(processCommand);
        }
        const startTime = new Date();
        await jobQueue.runParallel();
        const endTime = new Date();

        console.log(`Parallel run time: ${endTime.getTime() - startTime.getTime()}ms`);
        jobQueue.stop();
        expect(jobQueue.completed.length).to.equal(100000);
    });
});