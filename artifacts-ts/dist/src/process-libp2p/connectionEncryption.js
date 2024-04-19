import { noise } from '@chainsafe/libp2p-noise';
import { tls } from '@libp2p/tls';
import { createProcessOption } from '../process-interface/index.js';
const connectionEncryptionOptions = [
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
];
const connectionEncryption = ({ enableNoise, enableTls } = {}) => {
    let connectionEncryption = new Array();
    if (enableNoise) {
        connectionEncryption.push(noise());
    }
    if (enableTls) {
        connectionEncryption.push(tls());
    }
    return connectionEncryption;
};
export { connectionEncryption, connectionEncryptionOptions };
