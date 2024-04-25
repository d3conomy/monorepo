import { ProtectorComponents, preSharedKey } from '@libp2p/pnet'
import { ConnectionProtector } from '@libp2p/interface'
import crypto from 'crypto';
import { IProcessOptionsList, createProcessOption, injectDefaultValues, mapProcessOptions } from '../process-interface/index.js';



const connectionProtectorOptions: IProcessOptionsList = [
    createProcessOption({
        name: 'swarmKeyAsHex',
        description: 'Swarm key as hexadecimal',
        defaultValue: ''
    })
]


/**
 * Create a new pre-shared key for the swarm
 * @category Libp2p
 */
const createSwarmKey = (
    swarmKeyAsHex?: string
): Uint8Array => {
    // Generate a random 256-bit key
    const key = crypto.randomBytes(32);

    // Convert the key to base16 (hexadecimal)
    const swarmKey = swarmKeyAsHex ? swarmKeyAsHex : key.toString('hex');

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
function connectionProtector({...values}: {} = {}): 
    (components: ProtectorComponents) => ConnectionProtector {
    const injectedDefaultValues = injectDefaultValues({options: connectionProtectorOptions, values})
    const { swarmKeyAsHex } = mapProcessOptions(injectedDefaultValues)

    const swarmKey = createSwarmKey(swarmKeyAsHex);

    const protector: any = preSharedKey({
        psk: swarmKey as Uint8Array
    });

    return protector;
}

export {
    createSwarmKey,
    connectionProtector,
    connectionProtectorOptions
}