import { MemoryDatastore } from "datastore-core";
import { MemoryBlockstore } from "blockstore-core";
import { LevelBlockstore } from "blockstore-level";
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
/**
 * The options for creating an Ipfs process
 * @category IPFS
 */
class IpfsOptions {
    libp2p;
    datastore;
    blockstore;
    start;
    constructor({ libp2p, datastore, blockstore, blockstorePath, start, }) {
        if (!libp2p) {
            throw new Error(`No Libp2p process found`);
        }
        this.libp2p = libp2p;
        this.datastore = datastore ? datastore : new MemoryDatastore();
        this.blockstore = createBlockStore(blockstore, blockstorePath ? blockstorePath : `./data/pods/${libp2p.id.podId.toString()}/ipfs/blockstore`);
        this.start = start ? start : false;
    }
}
export { IpfsOptions };
