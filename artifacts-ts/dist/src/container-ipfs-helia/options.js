import { MemoryDatastore } from "datastore-core";
import { MemoryBlockstore } from "blockstore-core";
import { LevelBlockstore } from "blockstore-level";
import { InstanceOptions } from "../container/options.js";
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
const ipfsOptions = () => {
    return new InstanceOptions({ options: [
            {
                name: 'libp2p',
                description: 'Libp2p container',
                required: true
            },
            {
                name: 'datastore',
                description: 'Datastore',
                required: false,
                defaultValue: new MemoryDatastore()
            },
            {
                name: 'blockstore',
                description: 'Blockstore',
                required: false,
                defaultValue: new MemoryBlockstore()
            },
            {
                name: 'blockstorePath',
                description: 'Blockstore path',
                required: false,
            },
            {
                name: 'start',
                description: 'Start the instance',
                required: false,
                defaultValue: false
            }
        ] });
};
/**
 * The options for creating an Ipfs process
 * @category IPFS
 */
class IpfsOptions extends InstanceOptions {
    constructor(options, defaults = true) {
        super({ options: options?.toArray(), injectDefaults: defaults, defaults: ipfsOptions() });
        this.init();
    }
    init() {
        if (this.get('blockstorePath') !== undefined) {
            this.set('blockstore', createBlockStore(BlockStores.LEVEL, this.get('blockstorePath')));
        }
    }
}
export { ipfsOptions, IpfsOptions };
