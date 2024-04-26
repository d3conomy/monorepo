
import { IProcessOptionsList, createProcessOption, injectDefaultValues, mapProcessOptions } from "../process-interface/index.js";


const connectionGaterOptions = (): IProcessOptionsList => [
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

const connectionGater = ({...values}: {}= {}): any => {

    const injectedDefaultValues = injectDefaultValues({options: connectionGaterOptions(), values})

    const {
        enableDenyDialMultiaddr,
        denyDialMultiaddr
    } = mapProcessOptions(injectedDefaultValues)

    // console.log(`enableDenyDialMultiaddr: ${enableDenyDialMultiaddr}`)
    // console.log(`denyDialMultiaddr: ${denyDialMultiaddr}`)
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
