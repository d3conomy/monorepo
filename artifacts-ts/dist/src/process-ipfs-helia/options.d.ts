import { MemoryBlockstore } from "blockstore-core";
import { LevelBlockstore } from "blockstore-level";
import { IProcessOptionsList } from "../process-interface/processOptions.js";
import { Libp2pProcess } from "../process-libp2p/process.js";
type BlockStore = MemoryBlockstore | LevelBlockstore;
declare const ipfsOptions: () => IProcessOptionsList;
/**
 * The options for creating an Ipfs process
 * @category IPFS
 */
declare class IpfsOptions {
    libp2p: Libp2pProcess;
    datastore: any;
    blockstore: BlockStore;
    start: boolean;
    constructor({ ...values }?: {});
}
export { ipfsOptions, IpfsOptions };
//# sourceMappingURL=options.d.ts.map