import { createHelia, } from "helia";
import { ipfsCommands } from "./commands.js";
import { Container } from "../container/index.js";
import { InstanceTypes } from "../container/instance.js";
import { ipfsOptions } from "./options.js";
// class HeliaLibp2pProcess extends HeliaLibp2p {
// }
/**
 * Create an IPFS process
 * @category IPFS
 */
const ipfsHeliaInitializer = async (options) => {
    options.injectDefaults(ipfsOptions());
    const { libp2p, blockstore, datastore, start } = options.toParams();
    const helia = await createHelia({
        libp2p: libp2p.getInstance(),
        blockstore: blockstore,
        datastore: datastore,
        start: start
    });
    return helia;
};
/**
 * The process container for the IPFS process
 *
 * Helia is used as the IPFS process
 * @category IPFS
 */
class IpfsContainer extends Container {
    constructor(id, options) {
        super({
            id,
            type: InstanceTypes.IPFS,
            options,
            initializer: ipfsHeliaInitializer,
            commands: ipfsCommands,
        });
    }
}
export { IpfsContainer };
export * from './commands.js';
export * from './options.js';
