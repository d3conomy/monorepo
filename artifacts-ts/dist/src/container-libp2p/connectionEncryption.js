import { noise } from '@chainsafe/libp2p-noise';
import { tls } from '@libp2p/tls';
import { InstanceOptions } from '../container/options.js';
const connectionEncryptionOptions = () => {
    return new InstanceOptions({ options: [
            {
                name: 'enableNoise',
                description: 'Enable Noise encryption',
                defaultValue: true
            },
            {
                name: 'enableTls',
                description: 'Enable TLS encryption',
                defaultValue: true
            }
        ] });
};
const connectionEncryption = (options) => {
    const { enableNoise, enableTls } = options.toParams();
    let connectionEncryption = new Array();
    if (enableNoise === true) {
        connectionEncryption.push(noise());
    }
    if (enableTls === true) {
        connectionEncryption.push(tls());
    }
    return connectionEncryption;
};
export { connectionEncryption, connectionEncryptionOptions };
