import { LunarPod } from "../db/pod.js";
import { IdReference } from "../utils/id.js";
import { Component, LogLevel, logger } from "../utils/index.js";
import { expect } from "chai";

describe('LunarPod', () => {
    let peer: LunarPod | null = null;

    beforeEach(() => {
        peer = null;
        peer = new LunarPod({
            id: new IdReference({
                component: Component.LIBP2P
            })
        });
    });

    afterEach(async () => {
        await peer?.libp2p?.stop();
        peer = null;
    })

    it('should create a peer', async () => {
        await peer?.initLibp2p();
        expect(peer).to.be.not.null;
        expect(peer?.id).to.be.not.null;
        expect(peer?.libp2p).to.be.not.null;
        expect(peer?.ipfs).to.be.undefined;
        expect(peer?.orbitDb).to.be.undefined;
        expect(peer?.db.size).to.be.equal(0);

        logger({
            level: LogLevel.INFO,
            message: `Peer id: ${peer?.libp2p?.peerId()}`
        })

        await peer?.libp2p?.start();

        logger({
            level: LogLevel.INFO,
            message: `Peer status: ${peer?.status()}`
        })

        await peer?.libp2p?.stop();
    })

    it('should create an IPFS node', async () => {
        await peer?.initLibp2p({});
        await peer?.initIpfs({});
        expect(peer).to.be.not.null;
        expect(peer?.id).to.be.not.null;
        expect(peer?.libp2p).to.be.not.null;
        expect(peer?.ipfs).to.be.not.null;
        expect(peer?.orbitDb).to.be.undefined;
        expect(peer?.db.size).to.be.equal(0);


        await peer?.libp2p?.start();
        logger({
            level: LogLevel.INFO,
            message: `Peer id: ${peer?.libp2p?.process?.peerId.toString()}`
        })
        await peer?.libp2p?.stop();
        await peer?.ipfs?.stop();
    })

    it('should create an OrbitDB instance', async () => {
        await peer?.initLibp2p();
        await peer?.initIpfs();
        await peer?.initOrbitDb();
        expect(peer).to.be.not.null;
        expect(peer?.id).to.be.not.null;
        expect(peer?.libp2p).to.be.not.null;
        expect(peer?.ipfs).to.be.not.null;
        expect(peer?.orbitDb).to.be.not.null;
        expect(peer?.db.size).to.be.equal(0);

        logger({
            level: LogLevel.INFO,
            message: `Peer id: ${peer?.libp2p?.peerId()}`
        })

        await peer?.orbitDb?.stop()
        await peer?.ipfs?.stop();
        await peer?.libp2p?.stop();
    })

    it('should open a database', async () => {
        await peer?.initLibp2p();
        await peer?.libp2p?.start();
        await peer?.initIpfs();
        await peer?.initOrbitDb();
        await peer?.initOpenDb();
        expect(peer).to.be.not.null;
        expect(peer?.id).to.be.not.null;
        expect(peer?.libp2p).to.be.not.null;
        expect(peer?.ipfs).to.be.not.null;
        expect(peer?.orbitDb).to.be.not.null;
        expect(peer?.db.size).to.be.equal(1);

        logger({
            level: LogLevel.INFO,
            message: `Peer id: ${peer?.libp2p?.peerId()}`
        })

        await peer?.stop();
    });
})