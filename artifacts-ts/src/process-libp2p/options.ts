import {Libp2pOptions } from "libp2p";

import { IProcessOption, IProcessOptions, createProcessOption, formatProcessOptions } from "../process-interface";
import { listenAddressesConfig, listenAddressesOptions } from "./address.js";
import { bootstrapOptions } from "./bootstrap";
import { connectionEncryption, connectionEncryptionOptions } from "./connectionEncryption.js";
import { connectionGater, connectionGaterOptions } from "./connectionGater.js";
import { connectionProtector, connectionProtectorOptions } from "./connectionProtector.js";
import { peerDiscovery, peerDiscoveryOptions } from "./peerDiscovery.js";
import { libp2pPeerId, peerIdOptions } from "./peerId";
import { libp2pServices, serviceOptions } from "./services.js";
import { streamMuxerOptions, streamMuxers } from "./streamMuxers.js";
import { transportOptions, transports } from "./transports.js";

const libp2pOptions = (): IProcessOptions => {
    let loadedOptions = new Array();

    const autostartOption: IProcessOption = createProcessOption({
        name: 'autoStart',
        description: 'Auto start',
        required: false,
        defaultValue: true
    });

    let options = [
        autostartOption,
        ...listenAddressesOptions,
        ...bootstrapOptions,
        ...connectionEncryptionOptions,
        ...connectionGaterOptions,
        ...connectionProtectorOptions,
        ...peerDiscoveryOptions,
        ...peerIdOptions,
        ...serviceOptions,
        ...streamMuxerOptions,
        ...transportOptions
    ]

    for (const option of options) {
        if (option.name in loadedOptions) {
            continue;
        }
        loadedOptions.push(option.name);
    }
    return loadedOptions;
}

const buildSubProcesses = async (options: IProcessOptions) => {
    const subprocessOptions = formatProcessOptions(options)
    const libp2pOptions: Libp2pOptions = {
        start: subprocessOptions.find((option: IProcessOption) => option.name === 'autoStart')?.value,
        addresses: listenAddressesConfig(subprocessOptions),
        transports: transports(subprocessOptions),
        connectionEncryption: connectionEncryption(subprocessOptions),
        connectionGater: connectionGater(subprocessOptions),
        peerDiscovery: peerDiscovery(subprocessOptions),
        services: libp2pServices(subprocessOptions),
        streamMuxers: streamMuxers(subprocessOptions)
    }

    const peerIdOption = subprocessOptions.find((option: IProcessOption) => option.name === 'peerId');
    if(peerIdOption) {
        libp2pOptions.peerId = await libp2pPeerId(peerIdOption.value);
    }

    const enablePrivateSwarm = subprocessOptions.find((option: IProcessOption) => option.name === 'enablePrivateSwarm')?.value;
    if(enablePrivateSwarm) {
        libp2pOptions.connectionProtector = connectionProtector({
            swarmKeyAsHex: subprocessOptions.find((option: IProcessOption) => option.name === 'privateSwarmKey')?.value,
        });
    }
    
    return libp2pOptions;
}

export {
    buildSubProcesses,
    libp2pOptions
}


