import { Libp2pOptions } from "libp2p";
import { InstanceOption, InstanceOptions, InstanceOptionsList, createOptionsList } from "../container/options.js";
import { bootstrapOptions } from './bootstrap.js';
import { connectionEncryption, connectionEncryptionOptions } from "./connectionEncryption.js";
import { connectionGater, connectionGaterOptions } from "./connectionGater.js";
import { connectionProtector, connectionProtectorOptions } from "./connectionProtector.js";
import { peerDiscovery, peerDiscoveryOptions } from "./peerDiscovery.js";
import { libp2pPeerId, peerIdOptions } from "./peerId.js";
import { libp2pServices, serviceOptions } from "./services.js";
import { streamMuxerOptions, streamMuxers } from "./streamMuxers.js";
import { transportOptions, transports } from "./transports.js";
import { listenAddressesConfig, listenAddressesOptions } from "./addresses.js";

const defaultLibp2pOptions = (): InstanceOptions => {
    return new InstanceOptions({options: [
        {
            name: 'start',
            description: 'Start libp2p',
            defaultValue: false
        } as InstanceOption<boolean>,
        ...listenAddressesOptions().toArray(),
        ...bootstrapOptions().toArray(),
        ...connectionEncryptionOptions().toArray(),
        ...connectionGaterOptions().toArray(),
        ...connectionProtectorOptions().toArray(),
        ...peerDiscoveryOptions().toArray(),
        ...peerIdOptions().toArray(),
        ...serviceOptions().toArray(),
        ...streamMuxerOptions().toArray(),
        ...transportOptions().toArray()
    ]})
}

const createLibp2pOptions= async (options: InstanceOptions = defaultLibp2pOptions()): Promise<Libp2pOptions> => {

    options.injectDefaults(defaultLibp2pOptions())

    const {
        start
    } = options.toParams()

     const libp2pOptions: Libp2pOptions = {
        start,
        addresses: listenAddressesConfig(options),
        connectionEncryption: connectionEncryption(options),
        connectionGater: connectionGater(options) as any,
        connectionProtector: connectionProtector(options),
        peerDiscovery: peerDiscovery(options),
        peerId: await libp2pPeerId(options),
        services: libp2pServices(options),
        streamMuxers: streamMuxers(options),
        transports: transports(options)
    }

    const enablePrivateSwarm = options.get('enablePrivateSwarm').value

    if (enablePrivateSwarm === true) {
        libp2pOptions.connectionProtector = connectionProtector(options)
    }

    return libp2pOptions
}

export {
    defaultLibp2pOptions,
    createLibp2pOptions
}

