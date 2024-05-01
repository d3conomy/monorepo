import { createEd25519PeerId } from '@libp2p/peer-id-factory';
import { peerIdFromString, peerIdFromPeerId } from '@libp2p/peer-id';
import { InstanceOptions, createOptionsList } from '../container/options.js';
const peerIdOptions = () => {
    return new InstanceOptions({ options: createOptionsList([
            {
                name: 'id',
                description: 'PeerId',
                required: false,
                defaultValue: undefined
            }
        ]) });
};
/**
 * Create a PeerId
 * @category Libp2p
 */
const libp2pPeerId = async (options) => {
    const { id } = options.toParams();
    let peerId;
    if (typeof id === 'string') {
        peerId = peerIdFromString(id);
    }
    else if (id !== undefined) {
        peerId = peerIdFromPeerId(id);
    }
    else {
        peerId = await createEd25519PeerId();
    }
    return peerId;
};
export { libp2pPeerId, peerIdOptions };
