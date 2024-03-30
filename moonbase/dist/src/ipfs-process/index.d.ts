import { HeliaLibp2p } from "helia";
import { CID } from "multiformats";
import { Libp2p } from "libp2p";
import { IpfsOptions } from "./IpfsOptions.js";
import { IProcess, IdReference, ProcessStage } from "d3-artifacts";
/**
 * Create an IPFS process
 * @category IPFS
 */
declare const createIpfsProcess: ({ libp2p, datastore, blockstore, start }: IpfsOptions) => Promise<HeliaLibp2p<Libp2p>>;
/**
 * The process container for the IPFS process
 *
 * Helia is used as the IPFS process
 * @category IPFS
 */
declare class IpfsProcess implements IProcess {
    id: IdReference;
    process?: HeliaLibp2p<Libp2p>;
    options?: IpfsOptions;
    /**
     * Constructor for the Ipfs process
     */
    constructor({ id, process, options }: {
        id: IdReference;
        process?: HeliaLibp2p<Libp2p>;
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
    /**
     * Get Libp2p from IPFS
     */
    getLibp2p(): Libp2p | undefined;
}
export { createIpfsProcess, IpfsProcess };
export * from "./IpfsOptions.js";
//# sourceMappingURL=index.d.ts.map