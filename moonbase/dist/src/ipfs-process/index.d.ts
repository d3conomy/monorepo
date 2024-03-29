import { Helia } from "helia";
import { CID } from "multiformats";
import { IpfsOptions } from "./IpfsOptions.js";
import { IProcess, IdReference, ProcessStage } from "d3-artifacts";
/**
 * Create an IPFS process
 * @category IPFS
 */
declare const createIpfsProcess: ({ libp2p, datastore, blockstore, start }: IpfsOptions) => Promise<Helia>;
/**
 * The process container for the IPFS process
 *
 * Helia is used as the IPFS process
 * @category IPFS
 */
declare class IpfsProcess implements IProcess {
    id: IdReference;
    process?: Helia;
    options?: IpfsOptions;
    /**
     * Constructor for the Ipfs process
     */
    constructor({ id, process, options }: {
        id: IdReference;
        process?: Helia;
        options?: IpfsOptions;
    });
    /**
     * Check if the IPFS process exists
     */
    checkProcess(): boolean;
    /**
     * Initialize the IPFS Process
     */
    init(): Promise<void>;
    /**
     * Get the status of the IPFS process
     */
    status(): ProcessStage;
    /**
     * Start the IPFS process
     */
    start(): Promise<void>;
    /**
     * Stop the IPFS process
     */
    stop(): Promise<void>;
    /**
     * Restart the IPFS process
     */
    restart(): Promise<void>;
    /**
     * Add a JSON object to IPFS
     */
    addJson(data: any): Promise<CID | undefined>;
    /**
     * Get a JSON object from IPFS
     */
    getJson(cid: string): Promise<any | undefined>;
}
export { createIpfsProcess, IpfsProcess };
//# sourceMappingURL=index.d.ts.map