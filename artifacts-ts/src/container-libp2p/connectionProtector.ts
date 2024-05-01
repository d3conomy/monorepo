import { ProtectorComponents, preSharedKey } from '@libp2p/pnet'
import { ConnectionProtector } from '@libp2p/interface'
import crypto from 'crypto';
import { InstanceOption, InstanceOptions, createOptionsList } from '../container/options.js'



const connectionProtectorOptions = (): InstanceOptions => {
    return new InstanceOptions({options: createOptionsList([
        {
            name: 'swarmKeyAsHex',
            description: 'Swarm key as hexadecimal',
            defaultValue: ''
        } as InstanceOption<string>
    ])})
}


/**
 * Create a new pre-shared key for the swarm
 * @category Libp2p
 */
const createSwarmKey = (
    swarmKeyAsHex?: string
): Uint8Array => {
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
}




/**
 * Create a connection protector using a pre-shared key
 * @category Libp2p
 */
function connectionProtector(options: InstanceOptions): 
    (components: ProtectorComponents) => ConnectionProtector {

    const { swarmKeyAsHex } = options.toParams();
    const swarmKey: Uint8Array = createSwarmKey(swarmKeyAsHex);
    const protector: any = preSharedKey({
        psk: swarmKey
    });

    return protector;
}

export {
    createSwarmKey,
    connectionProtector,
    connectionProtectorOptions
}