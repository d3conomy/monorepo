import { preSharedKey } from '@libp2p/pnet';
import crypto from 'crypto';
import { InstanceOptions, createOptionsList } from '../container/options.js';
const connectionProtectorOptions = () => {
    return new InstanceOptions({ options: createOptionsList([
            {
                name: 'swarmKeyAsHex',
                description: 'Swarm key as hexadecimal',
                defaultValue: ''
            }
        ]) });
};
/**
 * Create a new pre-shared key for the swarm
 * @category Libp2p
 */
const createSwarmKey = (swarmKeyAsHex) => {
    // Generate a random 256-bit key
    let key = crypto.randomBytes(32);
    // Convert the key to base16 (hexadecimal)
    if (swarmKeyAsHex && swarmKeyAsHex.length === 64) {
        key = Buffer.from(swarmKeyAsHex, 'hex');
    }
    const swarmKey = key.toString('hex');
    // append the propers headers
    const headers = '/key/swarm/psk/1.0.0/\n';
    const base = '/base16/\n';
    const fullKey = headers + base + swarmKey;
    return new TextEncoder().encode(fullKey);
};
/**
 * Create a connection protector using a pre-shared key
 * @category Libp2p
 */
function connectionProtector(options) {
    const { swarmKeyAsHex } = options.toParams();
    const swarmKey = createSwarmKey(swarmKeyAsHex);
    const protector = preSharedKey({
        psk: swarmKey
    });
    return protector;
}
export { createSwarmKey, connectionProtector, connectionProtectorOptions };
