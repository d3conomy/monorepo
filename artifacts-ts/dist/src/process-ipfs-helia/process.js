import { createHelia, } from "helia";
import { Process } from "../process-interface/process.js";
import { createProcessContainer } from "../process-interface/processContainer.js";
import { ProcessType } from "../process-interface/processTypes.js";
import { ipfsCommands } from "./commands.js";
// class HeliaLibp2pProcess extends HeliaLibp2p {
// }
/**
 * Create an IPFS process
 * @category IPFS
 */
const createIpfsInstance = async (instanceOptions) => {
    const helia = await createHelia({
        libp2p: instanceOptions.find(option => option.name === 'libp2p')?.value,
        blockstore: instanceOptions.find(option => option.name === 'blockstore')?.value,
        datastore: instanceOptions.find(option => option.name === 'datastore')?.value,
        start: instanceOptions.find(option => option.name === 'start')?.value
    });
    return helia;
};
/**
 * The process container for the IPFS process
 *
 * Helia is used as the IPFS process
 * @category IPFS
 */
class IpfsProcess extends Process {
    /**
     * Constructor for the Ipfs process
     */
    constructor({ id, container, options, commands }) {
        if (container?.instance === undefined) {
            if (options === undefined) {
                options = [];
            }
            const init = async (processOptions) => {
                if (processOptions === undefined) {
                    throw new Error(`No IPFS options found, include a libp2p process in the options`);
                }
                return await createIpfsInstance(processOptions);
            };
            container = createProcessContainer({
                type: ProcessType.IPFS,
                instance: undefined,
                options,
                init
            });
        }
        super(id, container, commands ? commands : ipfsCommands);
    }
    async stop() {
        this.jobQueue.stop();
        this.container?.instance?.stop();
    }
}
const createIpfsProcess = async (id, options) => {
    const process = new IpfsProcess({
        id,
        options,
        commands: ipfsCommands
    });
    await process.init();
    return process;
};
export { createIpfsInstance, createIpfsProcess, IpfsProcess };
