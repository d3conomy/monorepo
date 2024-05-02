import { createEd25519PeerId } from '@libp2p/peer-id-factory';
import { peerIdFromString, peerIdFromPeerId } from '@libp2p/peer-id';
import { PeerId } from '@libp2p/interface';
import { InstanceOption, InstanceOptions, createOptionsList } from '../container/options.js';


const peerIdOptions = (): InstanceOptions => {
    return new InstanceOptions({options: [
        {
            name: 'id',
            description: 'PeerId',
            required: false,
            defaultValue: undefined
        } as InstanceOption<PeerId>
    ]})
}

/**
 * Create a PeerId
 * @category Libp2p
 */
const libp2pPeerId = async (options: InstanceOptions): Promise<PeerId> => {

    const { id } = options.toParams()

    let peerId: PeerId;

    if (typeof id === 'string') {
        peerId = peerIdFromString(id)
    }
    else if (id !== undefined) {
        peerId = peerIdFromPeerId(id)
    }
    else {
        peerId = await createEd25519PeerId()
    }

    return peerId;
}

export {
    libp2pPeerId,
    peerIdOptions
}

