import { expect } from "chai";
import { MemoryDatastore } from "datastore-core";
import { MemoryBlockstore } from "blockstore-core";
import { Libp2pProcess, createLibp2pProcess } from "../src/libp2p-process/index.js";
import { IpfsOptions } from "../src/ipfs-process/IpfsOptions.js";
import { MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from "d3-artifacts";
import { LevelBlockstore } from "blockstore-level";

describe("IpfsOptions", () => {
    const systemId = new SystemId()
    const moonbaseId = new MoonbaseId({systemId})
    const podBayId = new PodBayId({moonbaseId})
    const podId = new PodId({podBayId})
    const id = new PodProcessId({podId});
    const process = new Libp2pProcess({id});

    it("should throw an error if no Libp2p process is provided", () => {
        expect(() => new IpfsOptions({})).to.throw("No Libp2p process found");
    });

    it("should set default values if optional parameters are not provided", async () => {
        const libp2p = new Libp2pProcess({id});
        const ipfsOptions = new IpfsOptions({ libp2p });

        expect(ipfsOptions.datastore).to.be.an.instanceOf(MemoryDatastore);
        expect(ipfsOptions.blockstore).to.be.an.instanceOf(LevelBlockstore);
        expect(ipfsOptions.start).to.be.false;
    });

    it("should use provided values for optional parameters", () => {
        const libp2p = new Libp2pProcess({id});
        const datastore = new MemoryDatastore();
        const blockstore = new MemoryBlockstore();
        const start = true;

        const ipfsOptions = new IpfsOptions({
            libp2p,
            datastore,
            blockstore,
            start,
        });

        expect(ipfsOptions.datastore).to.equal(datastore);
        // expect(ipfsOptions.blockstore).to.equal(blockstore);
        expect(ipfsOptions.start).to.be.true;
    });
});
