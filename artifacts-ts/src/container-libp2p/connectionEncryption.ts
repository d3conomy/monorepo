
import { noise } from '@chainsafe/libp2p-noise'
import { tls } from '@libp2p/tls'
import { InstanceOption, InstanceOptions, createOptionsList } from '../container/options.js'


const connectionEncryptionOptions = (): InstanceOptions => {
    return new InstanceOptions({options: createOptionsList([
        {
            name: 'enableNoise',
            description: 'Enable Noise encryption',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'enableTls',
            description: 'Enable TLS encryption',
            defaultValue: true
        } as InstanceOption<boolean>
    ])})
}

const connectionEncryption = (options: InstanceOptions): Array<any>  => {
    const { enableNoise, enableTls } = options.toParams()

    let connectionEncryption: Array<any> = new Array<any>();

    if (enableNoise === true) {
        connectionEncryption.push(noise())
    }
    if (enableTls === true) {
        connectionEncryption.push(tls())
    }
    return connectionEncryption; 
}

export {
    connectionEncryption,
    connectionEncryptionOptions
}