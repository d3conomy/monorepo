import { createHelia, } from "helia";
import { ipfsCommands } from "./commands.js";
import { Container } from "../container/index.js";
import { InstanceTypes } from "../container/instance.js";
// class HeliaLibp2pProcess extends HeliaLibp2p {
// }
/**
 * Create an IPFS process
 * @category IPFS
 */
const IpfsHeliaInitializer = async (options) => {
    const { libp2p, blockstore, datastore, start, } = options.toParams();
    const helia = await createHelia({
        libp2p: libp2p,
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
            initializer: IpfsHeliaInitializer,
            commands: ipfsCommands,
        });
    }
}
export { IpfsContainer };
