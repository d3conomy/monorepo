
import { noise } from '@chainsafe/libp2p-noise'
import { tls } from '@libp2p/tls'
import { IProcessOptionsList, createProcessOption } from '../process-interface/index.js'

const connectionEncryptionOptions: IProcessOptionsList = [
    createProcessOption({
        name: 'enableNoise',
        description: 'Enable Noise encryption',
        defaultValue: true
    }),
    createProcessOption({
        name: 'enableTls',
        description: 'Enable TLS encryption',
        defaultValue: true
    })
]

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
    connectionEncryption,
    connectionEncryptionOptions
}