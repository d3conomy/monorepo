import { noise } from '@chainsafe/libp2p-noise';
import { tls } from '@libp2p/tls';
import { createProcessOption, injectDefaultValues, mapProcessOptions } from '../process-interface/index.js';
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
const connectionEncryption = ({ ...values } = {}) => {
    const injectedDefaultValues = injectDefaultValues({ options: connectionEncryptionOptions, values });
    const { enableNoise, enableTls } = mapProcessOptions(injectedDefaultValues);
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
