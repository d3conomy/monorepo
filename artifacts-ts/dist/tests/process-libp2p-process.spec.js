import { expect } from "chai";
import { describe, it } from "mocha";
import { Libp2pProcess, createLibp2pProcess } from "../src/process-libp2p/process.js";
import { JobId, MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from "../src/id-reference-factory/index.js";
import { createProcessOption } from "../src/process-interface/index.js";
import { libp2pCommands } from "../src/process-libp2p/commands.js";
describe("Libp2pProcess", () => {
    let processId;
    beforeEach(() => {
        const systemId = new SystemId();
        const moonbaseId = new MoonbaseId({ systemId: systemId });
        const podbayId = new PodBayId({ moonbaseId: moonbaseId });
        const podId = new PodId({ podBayId: podbayId });
        processId = new PodProcessId({ podId: podId });
    });
    it("should create a new instance of Libp2pProcess", () => {
        const process = new Libp2pProcess({
            id: processId,
            commands: libp2pCommands
        });
        expect(process).to.be.an.instanceOf(Libp2pProcess);
    });
    it("should initialize the process with the provided options", async () => {
        const options = [
            createProcessOption({
                name: 'start',
                value: true
            })
        ];
        const process = await createLibp2pProcess(processId, options);
        // await process.init()
        await process.process?.process?.start();
        expect(typeof process.process?.process).to.be.equal('object');
        await process.stop();
    });
    it("should initialize and run the peerId command", async () => {
        const options = [
            createProcessOption({
                name: 'start',
                value: true
            })
        ];
        // const process = new Libp2pProcess({
        //     id: processId,
        //     options,
        //     commands: libp2pCommands
        // });
        // await process.init()
        const process = await createLibp2pProcess(processId, options);
        // console.log(process)
        expect(typeof process.process?.process).to.be.equal('object');
        const executeCommand = {
            command: "peerId"
        };
        const jobId = new JobId({
            componentId: processId
        });
        const job = {
            jobId,
            ...executeCommand
        };
        process.jobQueue.enqueue(job);
        await process.start(true);
        // console.log(process.jobQueue.completed)
        expect(process.jobQueue.completed.length).to.be.equal(1);
        await process.stop();
    });
    it('should execute all the libp2pProcessCommands', async () => {
        const options = [
            createProcessOption({
                name: 'start',
                value: true
            })
        ];
        const process = new Libp2pProcess({
            id: processId,
            options,
            commands: libp2pCommands
        });
        await process.init();
        console.log(`process.process?.process: ${process.process?.process}`);
        expect(typeof process.process?.process).to.be.equal('object');
        for (const command in libp2pCommands) {
            // // console.log(libp2pCommands[command])
            const executeCommand = {
                command: libp2pCommands[command].name
            };
            const jobId = new JobId({
                componentId: processId
            });
            const job = {
                jobId,
                ...executeCommand
            };
            process.jobQueue.enqueue(job);
        }
        await process.start(false);
        // process.jobQueue.completed.forEach((job: IProcessJob) => {// console.log(job)})
        expect(process.jobQueue.completed.length).to.be.equal(12);
        await process.stop();
    });
});
