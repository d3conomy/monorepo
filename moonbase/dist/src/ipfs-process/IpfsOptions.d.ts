import { Libp2pProcess } from "../libp2p-process/index.js";
/**
 * The options for creating an Ipfs process
 * @category IPFS
 */
declare class IpfsOptions {
    libp2p: Libp2pProcess;
    datastore: any;
    blockstore: any;
    start: boolean;
    constructor({ libp2p, datastore, blockstore, start, }: {
        libp2p?: Libp2pProcess;
        datastore?: any;
        blockstore?: any;
        start?: boolean;
    });
}
export { IpfsOptions };
//# sourceMappingURL=IpfsOptions.d.ts.map