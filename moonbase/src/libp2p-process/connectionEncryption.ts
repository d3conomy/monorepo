
import { noise } from '@chainsafe/libp2p-noise'
import { tls } from '@libp2p/tls'

const connectionEncryption = ({
    enableNoise,
    enableTls
}: {
    enableNoise?: boolean,
    enableTls?: boolean
} = {}) => {
    let connectionEncryption: Array<any> = new Array<any>();
    if (enableNoise) {
        connectionEncryption.push(noise())
    }
    if (enableTls) {
        connectionEncryption.push(tls())
    }
    return connectionEncryption; 
}

export {
    connectionEncryption
}