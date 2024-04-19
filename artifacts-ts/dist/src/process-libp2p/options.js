import { createProcessOption, formatProcessOptions } from "../process-interface";
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
const libp2pOptions = () => {
    let loadedOptions = new Array();
    const autostartOption = createProcessOption({
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
    ];
    for (const option of options) {
        if (option.name in loadedOptions) {
            continue;
        }
        loadedOptions.push(option.name);
    }
    return loadedOptions;
};
const buildSubProcesses = async (options) => {
    const subprocessOptions = formatProcessOptions(options);
    const libp2pOptions = {
        start: subprocessOptions.find((option) => option.name === 'autoStart')?.value,
        addresses: listenAddressesConfig(subprocessOptions),
        transports: transports(subprocessOptions),
        connectionEncryption: connectionEncryption(subprocessOptions),
        connectionGater: connectionGater(subprocessOptions),
        peerDiscovery: peerDiscovery(subprocessOptions),
        services: libp2pServices(subprocessOptions),
        streamMuxers: streamMuxers(subprocessOptions)
    };
    const peerIdOption = subprocessOptions.find((option) => option.name === 'peerId');
    if (peerIdOption) {
        libp2pOptions.peerId = await libp2pPeerId(peerIdOption.value);
    }
    const enablePrivateSwarm = subprocessOptions.find((option) => option.name === 'enablePrivateSwarm')?.value;
    if (enablePrivateSwarm) {
        libp2pOptions.connectionProtector = connectionProtector({
            swarmKeyAsHex: subprocessOptions.find((option) => option.name === 'privateSwarmKey')?.value,
        });
    }
    return libp2pOptions;
};
export { buildSubProcesses, libp2pOptions };
