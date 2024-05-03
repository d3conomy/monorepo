import { expect } from "chai";
import { libp2pCommands } from "../src/container-libp2p/commands.js";
describe("libp2pCommands", () => {
    it("should return an object with libp2p commands", () => {
        const result = libp2pCommands;
        expect(result).to.be.an('object');
        expect(result.get('start').name).to.equal('start');
        expect(result.get('stop').name).to.equal('stop');
        expect(result.get('status').name).to.equal('status');
        expect(result.get('peerId').name).to.equal('peerId');
        expect(result.get('multiaddrs').name).to.equal('multiaddrs');
        expect(result.get('peers').name).to.equal('peers');
        expect(result.get('connections').name).to.equal('connections');
        expect(result.get('protocols').name).to.equal('protocols');
        expect(result.get('listeners').name).to.equal('listeners');
        expect(result.get('dial').name).to.equal('dial');
        expect(result.get('hangup').name).to.equal('hangup');
        expect(result.get('dialProtocol').name).to.equal('dialProtocol');
    });
});
