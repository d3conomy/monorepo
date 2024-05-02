
import { createHelia, HeliaLibp2p,} from "helia";
import { Libp2p } from "libp2p";


import { ipfsCommands } from "./commands.js";
import { ContainerId } from "../id-reference-factory/IdReferenceClasses.js";
import { Container } from "../container/index.js";
import { InstanceTypes } from "../container/instance.js";
import { InstanceOptions } from "../container/options.js";

// class HeliaLibp2pProcess extends HeliaLibp2p {

// }
/**
 * Create an IPFS process
 * @category IPFS
 */
const IpfsHeliaInitializer = async (
    options: InstanceOptions
): Promise<HeliaLibp2p<Libp2p>> => {
    const {
        libp2p,
        blockstore,
        datastore,
        start,
    } = options.toParams()

    const helia: HeliaLibp2p<Libp2p> = await createHelia({
        libp2p: libp2p,
        blockstore: blockstore,
        datastore: datastore,
        start: start
    })
    return helia as HeliaLibp2p<Libp2p>
}


/**
 * The process container for the IPFS process
 * 
 * Helia is used as the IPFS process
 * @category IPFS
 */
class IpfsContainer
    extends Container<InstanceTypes.IPFS>
{
    constructor(
        id: ContainerId,
        options?:InstanceOptions,
    ) {
        super({
            id,
            type: InstanceTypes.IPFS,
            options,
            initializer: IpfsHeliaInitializer,
            commands: ipfsCommands,

        })
    }
}

export {
    IpfsContainer
}

