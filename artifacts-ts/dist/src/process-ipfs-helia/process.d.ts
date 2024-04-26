import { HeliaLibp2p } from "helia";
import { Libp2p } from "libp2p";
import { IProcess, Process } from "../process-interface/process.js";
import { IProcessContainer } from "../process-interface/processContainer.js";
import { IProcessOption } from "../process-interface/processOptions.js";
import { IProcessCommand } from "../process-interface/processCommand.js";
import { PodProcessId } from "../id-reference-factory/IdReferenceClasses.js";
/**
 * Create an IPFS process
 * @category IPFS
 */
declare const createIpfsInstance: (instanceOptions: Array<IProcessOption>) => Promise<HeliaLibp2p<Libp2p>>;
/**
 * The process container for the IPFS process
 *
 * Helia is used as the IPFS process
 * @category IPFS
 */
declare class IpfsProcess extends Process implements IProcess {
    /**
     * Constructor for the Ipfs process
     */
    constructor({ id, container, options, commands }: {
        id: PodProcessId;
        container?: IProcessContainer;
        options?: Array<IProcessOption>;
        commands?: Array<IProcessCommand>;
    });
    stop(): Promise<void>;
}
declare const createIpfsProcess: (id: PodProcessId, options: Array<IProcessOption>) => Promise<IpfsProcess>;
export { createIpfsInstance, createIpfsProcess, IpfsProcess };
//# sourceMappingURL=process.d.ts.map