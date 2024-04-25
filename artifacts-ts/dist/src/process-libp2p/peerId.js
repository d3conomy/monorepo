import { createEd25519PeerId } from '@libp2p/peer-id-factory';
import { peerIdFromString, peerIdFromPeerId } from '@libp2p/peer-id';
import { createProcessOption, injectDefaultValues, mapProcessOptions } from '../process-interface/index.js';
const peerIdOptions = [
    createProcessOption({
        name: 'id',
        description: 'PeerId',
        required: false
    })
];
/**
 * Create a PeerId
 * @category Libp2p
 */
const libp2pPeerId = async ({ ...values } = {}) => {
    const injectedDefaultValues = injectDefaultValues({ options: peerIdOptions, values });
    const { id } = mapProcessOptions(injectedDefaultValues);
    let peerId;
    if (typeof id === 'string') {
        peerId = peerIdFromString(id);
    }
    else if (id) {
        peerId = peerIdFromPeerId(id);
    }
    else {
        peerId = await createEd25519PeerId();
    }
    return peerId;
};
export { libp2pPeerId, peerIdOptions };
