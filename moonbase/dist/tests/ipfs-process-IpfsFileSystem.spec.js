import { expect } from 'chai';
import { describe, it } from 'mocha';
import { CID } from 'multiformats';
import { IpfsOptions, IpfsProcess } from '../src/ipfs-process/index.js';
import { MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from 'd3-artifacts';
import { IpfsFileSystem, IpfsFileSystemType } from '../src/ipfs-process/IpfsFileSystem.js';
import { Libp2pProcess } from '../src/libp2p-process/process.js';
import fs from 'fs/promises';
describe('IpfsFileSystem', () => {
    let libp2p;
    let ipfs;
    let ipfsFileSystem;
    beforeEach(async () => {
        const systemId = new SystemId();
        const moonbaseId = new MoonbaseId({ systemId });
        const podBayId = new PodBayId({ moonbaseId });
        const podId = new PodId({ podBayId });
        const libp2pId = new PodProcessId({ podId });
        libp2p = new Libp2pProcess({ id: libp2pId });
        await libp2p.init();
        const ipfsId = new PodProcessId({ podId });
        // Initialize the IPFS process and IPFS file system before each test
        ipfs = new IpfsProcess({ id: ipfsId, options: new IpfsOptions({ libp2p }) });
        const filesystemId = new PodProcessId({ podId });
        await ipfs.init();
        ipfsFileSystem = new IpfsFileSystem({
            id: filesystemId,
            ipfs,
            filesystem: IpfsFileSystemType.UNIXFS,
        });
    });
    afterEach(async () => {
        // Clean up the IPFS process and IPFS file system after each test
        await ipfs.stop();
        await libp2p.stop();
    });
    describe('addBytes', () => {
        it('should add bytes to the IPFS file system', async () => {
            const data = new Uint8Array([1, 2, 3]);
            const cid = await ipfsFileSystem.addBytes(data);
            expect(cid).to.be.an.instanceOf(CID);
        });
    });
    describe('getBytes', () => {
        it('should get bytes from the IPFS file system', async () => {
            const cid = await ipfsFileSystem.addBytes(new Uint8Array([1, 2, 3]));
            const bytes = ipfsFileSystem.getBytes(cid);
            // Implement your assertion here
            let output = '';
            const textDecoder = new TextDecoder();
            for await (const chunk of bytes) {
                output += textDecoder.decode(chunk, { stream: true });
            }
            expect(output).to.equal('\u0001\u0002\u0003');
        });
    });
    describe('addFile', () => {
        it('should add a file to the IPFS file system', async () => {
            const data = await fs.readFile('../d3.png');
            const path = './d3.png';
            const cid = await ipfsFileSystem.addFile({ data, path });
            expect(cid).to.be.an.instanceOf(CID);
            console.log(cid.toString());
            for await (const chunk of ipfsFileSystem.ls(cid)) {
                // Implement your assertion here
                console.log(chunk);
            }
            expect(cid).to.be.an.instanceOf(CID);
        });
    });
    describe('stat', () => {
        it('should get the stats of a file in the IPFS file system', async () => {
            const data = new Uint8Array([1, 2, 3]);
            const cid = await ipfsFileSystem.addBytes(data);
            const stats = await ipfsFileSystem.stat(cid);
            console.log(stats);
            expect(stats).to.not.be.undefined;
        });
    });
    describe('rm', async () => {
        it('should remove a file from the IPFS file system', async () => {
            // const data = new Uint8Array([1, 2, 3]);
            const dirCid = await ipfsFileSystem.addDirectory({ path: 'test' });
            // const cid = await ipfsFileSystem.addBytes(data);
            // const mkdir = await ipfsFileSystem.mkdir(cid, 'test');
            const newCid = await ipfsFileSystem.addFile({
                data: await fs.readFile('../d3.png'),
                path: './test/d3.png'
            });
            const cpDir1 = await ipfsFileSystem.cp({
                source: newCid,
                target: dirCid,
                name: 'd3.png'
            });
            const newCid2 = await ipfsFileSystem.addFile({
                data: await fs.readFile('../d3.png'),
                path: './test/d4.png'
            });
            const cpDir = await ipfsFileSystem.cp({
                source: newCid2,
                target: cpDir1,
                name: 'd4.png'
            });
            // const rm = await ipfsFileSystem.rm(dirCid, 'd3.png');
            const stats = await ipfsFileSystem.stat(dirCid);
            console.log(stats);
            for await (const chunk of ipfsFileSystem.ls(cpDir)) {
                console.log(chunk);
            }
            expect(stats).to.not.be.undefined;
        });
    });
});
