
import { IProcessOptions, createProcessOption } from "../process-interface/index.js";


const connectionGaterOptions: IProcessOptions = [
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
]

/**
 * Default Connection Gater libp2p options
 * @category Libp2p
 */

const connectionGater = ({
    enableDenyDialMultiaddr = true,
    denyDialMultiaddr = false
}: {
    enableDenyDialMultiaddr?: boolean,
    denyDialMultiaddr?: boolean
}= {}): any => {
    let connectionGaters: Map<string, any> = new Map<string, any>();
    if (enableDenyDialMultiaddr) {
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
