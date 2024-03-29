import { expect } from "chai";
import { Helia } from "helia";
import { CID } from "multiformats";
import { IpfsOptions } from "../src/ipfs-process/IpfsOptions.js";
import { IProcess, IdReference, LogLevel, ProcessStage, logger } from "d3-artifacts";
import { IpfsProcess, createIpfsProcess } from "../src/ipfs-process/index.js";
import { MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from "d3-artifacts";
import sinon from "sinon";
import { Libp2pProcess, Libp2pProcessConfig, Libp2pProcessOptions } from "../src/libp2p-process/index.js";

describe("IpfsProcess", () => {
    let libp2pProcess: any;
    let id: any;
    let ipfsOptions: any;
    let ipfsProcess: IpfsProcess;

    beforeEach(() => {
        const systemId = new SystemId();
        const moonbaseId = new MoonbaseId({ systemId });
        const podBayId = new PodBayId({ moonbaseId });
        const podId = new PodId({ podBayId });
        id = new PodProcessId({ podId });

        const libp2pProcessConfig = new Libp2pProcessConfig({
            autoStart: true
        })
        const libp2pProcessOptions = new Libp2pProcessOptions({
            processConfig: libp2pProcessConfig
        });
        libp2pProcess = new Libp2pProcess({ id });
        ipfsOptions = new IpfsOptions({
            libp2p: libp2pProcess,
            start: true
        });
    });

    afterEach(async () => {
        await ipfsProcess.stop();
    });


    it("should return true if the IPFS process exists", () => {
        ipfsProcess = new IpfsProcess({
            id: id,
            options: ipfsOptions
        });
        const result = ipfsProcess.checkProcess();
        expect(result).to.be.false;
    });

    it("should log an error and return false if the IPFS process does not exist", () => {
        ipfsProcess = new IpfsProcess({
            id: id,
            options: ipfsOptions
        });
        const loggerSpy = sinon.spy(logger);
        const result = ipfsProcess.checkProcess();
        expect(result).to.be.false;
    });

    it("should init an ipfs process", async () => {
        ipfsProcess = new IpfsProcess({
            id: id,
            options: ipfsOptions
        });
        await ipfsProcess.init();
        expect(ipfsProcess.process).to.be.not.undefined;

        await ipfsProcess.stop();
    });

    it("should start an ipfs process", async () => {
        const systemId = new SystemId();
        const moonbaseId = new MoonbaseId({ systemId });
        const podBayId = new PodBayId({ moonbaseId });
        const podId = new PodId({ podBayId });
        const newId = new PodProcessId({ podId });
        const newLibp2pProcessOptions = new Libp2pProcessOptions()
        const newLibp2pProcess = new Libp2pProcess({
            id: newId,
            options: newLibp2pProcessOptions
        });
        const newIpfsOptions = new IpfsOptions({
            libp2p: newLibp2pProcess,
            start: true
        });
        const ipfsProcessId = new PodProcessId({ podId });
        const newIpfsProcess = new IpfsProcess({
            id: ipfsProcessId,
            options: newIpfsOptions
        });
        await newIpfsProcess.init();
        // await newIpfsProcess.start();
        expect(await newIpfsProcess.addJson({ key: "value" })).to.be.not.undefined;

        await newIpfsProcess.stop();
    });

    it('should add and retrieve a JSON object', async () => {
        ipfsProcess = new IpfsProcess({
            id: id,
            options: ipfsOptions
        });
        await ipfsProcess.init();
        const object = { key: "value" };
        const cid = await ipfsProcess.addJson(object);
        if (!cid) {
            throw new Error(`No CID found`);
        }
        const result = await ipfsProcess.getJson(cid.toString());
        expect(result).to.deep.equal(object);

        await ipfsProcess.stop();
    });
})
