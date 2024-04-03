import { noise } from '@chainsafe/libp2p-noise';
import { tls } from '@libp2p/tls';
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
export { connectionEncryption };
