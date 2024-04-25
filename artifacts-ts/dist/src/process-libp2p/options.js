import { ProcessOptions, createProcessOption } from "../process-interface/index.js";
import { listenAddressesConfig, listenAddressesOptions } from "./address.js";
import { bootstrapOptions } from "./bootstrap.js";
import { connectionEncryptionOptions } from "./connectionEncryption.js";
import { connectionGaterOptions } from "./connectionGater.js";
import { connectionProtector, connectionProtectorOptions } from "./connectionProtector.js";
import { peerDiscoveryOptions } from "./peerDiscovery.js";
import { libp2pPeerId, peerIdOptions } from "./peerId.js";
import { serviceOptions } from "./services.js";
import { streamMuxerOptions } from "./streamMuxers.js";
import { transportOptionsParams } from "./transports.js";
const converMaptoList = (map) => {
    if (map instanceof Map) {
        return Array.from(map).map(([key, value]) => {
            return createProcessOption({
                name: key,
                value
            });
        });
    }
    else {
        return Object.keys(map).map((key) => {
            return createProcessOption({
                name: key,
                value: map[key]
            });
        });
    }
};
const convertListToMap = (list) => {
    return new Map(list.map((option) => [option.name, option]));
};
const defaultProcessOptions = () => convertListToMap([
    ...listenAddressesOptions,
    ...bootstrapOptions,
    ...connectionEncryptionOptions,
    ...connectionGaterOptions,
    ...connectionProtectorOptions,
    ...peerDiscoveryOptions,
    ...peerIdOptions,
    ...serviceOptions,
    ...streamMuxerOptions,
    ...transportOptionsParams
]);
const libp2pOptionsParams = (options = new Array) => {
    const loadedOptions = convertListToMap(options);
    for (const [key, value] of defaultProcessOptions()) {
        const optionInput = loadedOptions.get(key);
        if (optionInput !== undefined) {
            if (optionInput) {
                loadedOptions.set(key, optionInput.value ? optionInput.value : value.defaultValue);
            }
        }
        else {
            if (optionInput !== undefined) {
                loadedOptions.set(key, value.value);
            }
            else {
                loadedOptions.set(key, value.defaultValue);
            }
        }
    }
    return new ProcessOptions(loadedOptions);
};
const buildSubProcesses = async (options) => {
    const subprocessOptions = libp2pOptionsParams(options);
    // const mappedSubprocessOptions = mapProcessOptions(subprocessOptions)
    // const libp2pOptionsParams: ProcessOptions = libp2pOptions(options);
    const libp2pOptions = {
        addresses: listenAddressesConfig(subprocessOptions),
        // connectionEncryption: connectionEncryption(subprocessOptions),
        // connectionGater: connectionGater(subprocessOptions),
        // connectionProtector: connectionProtector(subprocessOptions),
        // peerDiscovery: peerDiscovery(subprocessOptions),
        // peerId: await libp2pPeerId(subprocessOptions),
        // services: libp2pServices(subprocessOptions),
        // streamMuxer: streamMuxers(subprocessOptions),
        // transport: transports(subprocessOptions)
    };
    const peerIdOption = subprocessOptions.get('peerId')?.value;
    if (peerIdOption) {
        libp2pOptions.peerId = await libp2pPeerId(peerIdOption.value);
    }
    const enablePrivateSwarm = subprocessOptions.get('enablePrivateSwarm')?.value;
    if (enablePrivateSwarm) {
        libp2pOptions.connectionProtector = connectionProtector({
            swarmKeyAsHex: subprocessOptions.get('privateSwarmKey')?.value,
        });
    }
    return libp2pOptions;
};
export { converMaptoList, convertListToMap, libp2pOptionsParams, buildSubProcesses };
