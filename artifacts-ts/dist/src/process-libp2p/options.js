import { createProcessOption, formatProcessOptions } from "../process-interface/index.js";
import { listenAddressesConfig, listenAddressesOptions } from "./address.js";
import { bootstrapOptions } from "./bootstrap.js";
import { connectionEncryption, connectionEncryptionOptions } from "./connectionEncryption.js";
import { connectionGater, connectionGaterOptions } from "./connectionGater.js";
import { connectionProtector, connectionProtectorOptions } from "./connectionProtector.js";
import { peerDiscovery, peerDiscoveryOptions } from "./peerDiscovery.js";
import { libp2pPeerId, peerIdOptions } from "./peerId.js";
import { libp2pServices, serviceOptions } from "./services.js";
import { streamMuxerOptions, streamMuxers } from "./streamMuxers.js";
import { transportOptions, transports } from "./transports.js";
const libp2pOptions = (inputOptions) => {
    let loadedOptions = new Array();
    const autostartOption = createProcessOption({
        name: 'autoStart',
        description: 'Auto start the node',
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
        if (inputOptions && option.name in inputOptions) {
            const inputOptionValue = inputOptions.find((inputOption) => inputOption.name === option.name)?.value;
            option.value = inputOptionValue ? inputOptionValue : option.defaultValue;
        }
        loadedOptions.push(option.name);
    }
    return loadedOptions;
};
const buildSubProcesses = async (options) => {
    const subprocessOptions = formatProcessOptions(options);
    const libp2pOptions = {
        start: subprocessOptions.get((option) => option.name === 'autoStart')?.value,
        addresses: listenAddressesConfig(subprocessOptions),
        transports: transports({ ...subprocessOptions.entries }),
        connectionEncryption: connectionEncryption({ ...subprocessOptions.entries }),
        connectionGater: connectionGater({ ...subprocessOptions.entries }),
        peerDiscovery: peerDiscovery({ ...subprocessOptions.entries }),
        services: libp2pServices({ ...subprocessOptions.entries }),
        streamMuxers: streamMuxers({ ...subprocessOptions.entries })
    };
    const peerIdOption = subprocessOptions.get((option) => option.name === 'peerId')?.value;
    if (peerIdOption) {
        libp2pOptions.peerId = await libp2pPeerId(peerIdOption.value);
    }
    const enablePrivateSwarm = subprocessOptions.get((option) => option.name === 'enablePrivateSwarm')?.value;
    if (enablePrivateSwarm) {
        libp2pOptions.connectionProtector = connectionProtector({
            swarmKeyAsHex: subprocessOptions.get((option) => option.name === 'privateSwarmKey')?.value,
        });
    }
    return libp2pOptions;
};
export { buildSubProcesses, libp2pOptions };
