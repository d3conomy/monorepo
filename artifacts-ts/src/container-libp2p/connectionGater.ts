
import { InstanceOption, InstanceOptions, createOptionsList } from '../container/options.js'

const connectionGaterOptions = (): InstanceOptions => {
    return new InstanceOptions({options: [
        {
            name: 'enableDenyDialMultiaddr',
            description: 'Enable deny dial multiaddr',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'denyDialMultiaddr',
            description: 'Deny dial multiaddr',
            defaultValue: false
        } as InstanceOption<boolean>
    ]})
}

/**
 * Default Connection Gater libp2p options
 * @category Libp2p
 */

const connectionGater = (instanceOptions: InstanceOptions) => {
    const {
        enableDenyDialMultiaddr,
        denyDialMultiaddr
    } = instanceOptions.toParams()

    let connectionGaters: Map<string, any> = new Map<string, any>();
    
    if (enableDenyDialMultiaddr === true) {
        connectionGaters.set('denyDialMultiaddr', async () => {
            return denyDialMultiaddr
        })
    }
    return connectionGaters;
}

export {
    connectionGater,
    connectionGaterOptions
}
