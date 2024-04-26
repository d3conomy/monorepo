import { MemoryDatastore } from "datastore-core";
import { MemoryBlockstore } from "blockstore-core";
import { LevelBlockstore } from "blockstore-level";
import { createProcessOption, injectDefaultValues, mapProcessOptions } from "../process-interface/processOptions.js";
var BlockStores;
(function (BlockStores) {
    BlockStores["MEMORY"] = "MemoryBlockstore";
    BlockStores["LEVEL"] = "LevelBlockstore";
})(BlockStores || (BlockStores = {}));
const createBlockStore = (blockstore, path) => {
    switch (blockstore) {
        case BlockStores.MEMORY:
            return new MemoryBlockstore();
        case BlockStores.LEVEL:
        default:
            return new LevelBlockstore(path);
    }
};
const ipfsOptions = () => [
    createProcessOption({
        name: 'libp2p',
        description: 'Libp2p process',
        required: true
    }),
    createProcessOption({
        name: 'datastore',
        description: 'Datastore',
        required: false,
        defaultValue: new MemoryDatastore()
    }),
    createProcessOption({
        name: 'blockstore',
        description: 'Blockstore',
        required: false,
        defaultValue: new MemoryBlockstore()
    }),
    createProcessOption({
        name: 'blockstorePath',
        description: 'Blockstore path',
        required: false,
    }),
    createProcessOption({
        name: 'start',
        description: 'Start the process',
        required: false,
        defaultValue: false
    })
];
/**
 * The options for creating an Ipfs process
 * @category IPFS
 */
class IpfsOptions {
    libp2p;
    datastore;
    blockstore;
    start;
    constructor({ ...values } = {}) {
        const injectedDefaultValues = injectDefaultValues({ options: ipfsOptions(), values });
        const { libp2p, datastore, blockstore, blockstorePath, start, } = mapProcessOptions(injectedDefaultValues);
        if (!libp2p) {
            throw new Error(`No Libp2p process found`);
        }
        this.libp2p = libp2p;
        this.datastore = datastore ? datastore : new MemoryDatastore();
        this.blockstore = createBlockStore(blockstore, blockstorePath ? blockstorePath : `./data/pods/${libp2p.id.podId.toString()}/ipfs/blockstore`);
        this.start = start ? start : false;
    }
}
export { ipfsOptions, IpfsOptions };
