import { InstanceOptions } from '../container/options.js';
const connectionGaterOptions = () => {
    return new InstanceOptions({ options: [
            {
                name: 'enableDenyDialMultiaddr',
                description: 'Enable deny dial multiaddr',
                defaultValue: true
            },
            {
                name: 'denyDialMultiaddr',
                description: 'Deny dial multiaddr',
                defaultValue: false
            }
        ] });
};
/**
 * Default Connection Gater libp2p options
 * @category Libp2p
 */
const connectionGater = (instanceOptions) => {
    const { enableDenyDialMultiaddr, denyDialMultiaddr } = instanceOptions.toParams();
    let connectionGaters = new Map();
    if (enableDenyDialMultiaddr === true) {
        connectionGaters.set('denyDialMultiaddr', async () => {
            return denyDialMultiaddr;
        });
    }
    return connectionGaters;
};
export { connectionGater, connectionGaterOptions };
