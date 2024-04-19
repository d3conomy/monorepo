import { createProcessOption } from "../process-interface/index.js";
const connectionGaterOptions = [
    createProcessOption({
        name: 'enableDenyDialMultiaddr',
        description: 'Enable deny dial multiaddr',
        defaultValue: true
    }),
    createProcessOption({
        name: 'denyDialMultiaddr',
        description: 'Deny dial multiaddr',
        defaultValue: false
    })
];
/**
 * Default Connection Gater libp2p options
 * @category Libp2p
 */
const connectionGater = ({ enableDenyDialMultiaddr = true, denyDialMultiaddr = false } = {}) => {
    let connectionGaters = new Map();
    if (enableDenyDialMultiaddr) {
        connectionGaters.set('denyDialMultiaddr', async () => {
            return denyDialMultiaddr;
        });
    }
    return connectionGaters;
};
export { connectionGater, connectionGaterOptions };
