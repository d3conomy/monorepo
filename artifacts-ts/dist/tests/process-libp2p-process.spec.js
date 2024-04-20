import { expect } from "chai";
import { describe, it } from "mocha";
import { Libp2pProcess } from "../src/process-libp2p/process.js";
import { JobId, MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from "../src/id-reference-factory/index.js";
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
            options: [],
            commands: []
        });
        expect(process).to.be.an.instanceOf(Libp2pProcess);
    });
    it("should initialize the process with the provided options", async () => {
        const options = [
            {
                name: 'autoStart',
                value: true
            }
        ];
        const process = new Libp2pProcess({
            id: processId,
            options,
            commands: []
        });
        await process.init();
        console.log(process);
        expect(typeof process.process?.process).to.be.equal('object');
        await process.stop();
    });
    it("should initialize and run the peerId command", async () => {
        const options = [
            {
                name: 'autoStart',
                value: true
            }
        ];
        const process = new Libp2pProcess({
            id: processId,
            options,
            commands: libp2pCommands
        });
        await process.init();
        console.log(process);
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
        expect(process.jobQueue.completed.length).to.be.equal(1);
    });
});
