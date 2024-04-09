import { MemoryBlockstore } from "blockstore-core";
import { LevelBlockstore } from "blockstore-level";
import { Libp2pProcess } from "../libp2p-process/index.js";
type BlockStore = MemoryBlockstore | LevelBlockstore;
/**
 * The options for creating an Ipfs process
 * @category IPFS
 */
declare class IpfsOptions {
    libp2p: Libp2pProcess;
    datastore: any;
    blockstore: BlockStore;
    start: boolean;
    constructor({ libp2p, datastore, blockstore, blockstorePath, start, }: {
        libp2p?: Libp2pProcess;
        datastore?: any;
        blockstore?: any;
        blockstorePath?: string;
        start?: boolean;
    });
}
export { IpfsOptions };
//# sourceMappingURL=IpfsOptions.d.ts.map