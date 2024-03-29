"use strict";
// import { expect } from "chai";
// import { Helia } from "helia";
// import { CID } from "multiformats";
// import { IpfsOptions } from "../src/ipfs-process/IpfsOptions.js";
// import { IProcess, IdReference, LogLevel, ProcessStage, logger } from "d3-artifacts";
// import { IpfsProcess, createIpfsProcess } from "../src/ipfs-process/index.js";
// import { MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from "d3-artifacts";
// import sinon from "sinon";
// import { Libp2pProcess } from "../src/libp2p-process/index.js";
// describe("IpfsProcess", () => {
//     const systemId = new SystemId();
//     const moonbaseId = new MoonbaseId({ systemId });
//     const podBayId = new PodBayId({ moonbaseId });
//     const podId = new PodId({ podBayId });
//     let id: any
//     let libp2pProcess: any;
//     let ipfsProcess: any;
//     beforeEach(() => {
//         id = new PodProcessId({ podId });
//         libp2pProcess = new Libp2pProcess({ id });
//         id = new PodProcessId({ podId });
//         ipfsProcess = new IpfsProcess({
//             id: id,
//             options: new IpfsOptions({
//                 libp2p: libp2pProcess,
//                 start: true
//             })
//         });
//     });
//     describe("checkProcess", () => {
//         it("should return true if the IPFS process exists", () => {
//             const result = ipfsProcess.checkProcess();
//             expect(result).to.be.true;
//         });
//         it("should log an error and return false if the IPFS process does not exist", () => {
//             const loggerSpy = sinon.spy(logger);
//             const result = ipfsProcess.checkProcess();
//             expect(result).to.be.false;
//         });
//     });
//     describe("createIpfsProcess", () => {
//         it("should create an IPFS process", async () => {
//             const ipfsOptions = new IpfsOptions({
//                 libp2p: libp2pProcess,
//                 start: true
//             });
//             const ipfsProcess = await createIpfsProcess(ipfsOptions);
//             expect(ipfsProcess).to.not.be.undefined
//         });
//     });
//     describe("hasIdReference", () => {
//         it("should return true if the IPFS process has an ID reference", () => {
//             const result = ipfsProcess.id
//             expect(result).to.be.not.undefined;
//         });
//     });
//     describe("IpfsProcess", () => {
//         it("should create an instance of IpfsProcess", () => {
//             expect(ipfsProcess).to.be.an.instanceOf(IpfsProcess);
//         });
//         it("should initialize the IPFS process", async () => {
//             await ipfsProcess.init();
//             expect(ipfsProcess.process).to.be.not.undefined;
//             // await ipfsProcess.stop();
//         });
//         it("should return the IPFS process", () => {
//             const result = ipfsProcess.process;
//             expect(result).to.be.not.undefined;
//         });
//         it("should return the IPFS process ID", () => {
//             const result = ipfsProcess.id;
//             expect(result).to.be.not.undefined;
//         });
//         it("should fail to pull process status", async () => {
//             await ipfsProcess.init();
//             const result = ipfsProcess.status();
//             expect(result).to.be.undefined;
//             // await ipfsProcess.stop();
//         });
//     });
//     describe("IpfsProcess-start", () => {
//         afterEach(async () => {
//             await ipfsProcess.stop();
//             await libp2pProcess.stop();
//         });
//         it('should start the IPFS process', async () => {
//             await ipfsProcess.init();
//             await ipfsProcess.start();
//             expect(ipfsProcess.process).to.be.not.undefined;
//         });
//     });
// })
