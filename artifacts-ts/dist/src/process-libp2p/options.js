import { createProcessOption, mapProcessOptions } from "../process-interface/index.js";
import { listenAddressesConfig, listenAddressesOptions } from "./address.js";
import { bootstrapOptions } from "./bootstrap.js";
import { connectionEncryption, connectionEncryptionOptions } from "./connectionEncryption.js";
import { connectionGater, connectionGaterOptions } from "./connectionGater.js";
import { connectionProtector, connectionProtectorOptions } from "./connectionProtector.js";
import { peerDiscovery, peerDiscoveryOptions } from "./peerDiscovery.js";
import { libp2pPeerId, peerIdOptions } from "./peerId.js";
import { libp2pServices, serviceOptions } from "./services.js";
import { streamMuxerOptions, streamMuxers } from "./streamMuxers.js";
import { transportOptionsParams, transports } from "./transports.js";
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
    createProcessOption({
        name: 'start',
        description: 'Start libp2p',
        defaultValue: false
    }),
    ...listenAddressesOptions(),
    ...bootstrapOptions(),
    ...connectionEncryptionOptions(),
    ...connectionGaterOptions(),
    ...connectionProtectorOptions(),
    ...peerDiscoveryOptions(),
    ...peerIdOptions(),
    ...serviceOptions(),
    ...streamMuxerOptions(),
    ...transportOptionsParams()
]);
const libp2pOptionsParams = (options = new Array) => {
    const loadedOptions = convertListToMap(options);
    for (const [key, value] of defaultProcessOptions()) {
        console.log(`key: ${key}, value: ${JSON.stringify(value)}`);
        const optionInput = loadedOptions.get(key);
        if (optionInput !== undefined) {
            if (optionInput) {
                if (optionInput !== undefined) {
                    loadedOptions.set(key, optionInput);
                }
                else {
                    loadedOptions.set(key, value);
                }
            }
        }
        else {
            if (optionInput !== undefined) {
                loadedOptions.set(key, value);
            }
            else {
                loadedOptions.set(key, value);
            }
        }
    }
    // return new ProcessOptions(loadedOptions);
    return Array.from(loadedOptions).map(([key, value]) => {
        return createProcessOption({
            name: key,
            value
        });
    });
};
const buildSubProcesses = async (options) => {
    const subprocessOptions = libp2pOptionsParams(options);
    const mappedSubprocessOptions = mapProcessOptions(subprocessOptions);
    const libp2pOptionsParamsSet = {
        start: subprocessOptions.find((option) => option.name === 'start')?.value,
        addresses: listenAddressesConfig(mappedSubprocessOptions),
        connectionEncryption: connectionEncryption(mappedSubprocessOptions),
        connectionGater: connectionGater(mappedSubprocessOptions),
        connectionProtector: connectionProtector(mappedSubprocessOptions),
        peerDiscovery: peerDiscovery(mappedSubprocessOptions),
        // peerId: await libp2pPeerId(mappedSubprocessOptions),
        services: libp2pServices(mappedSubprocessOptions),
        streamMuxers: streamMuxers(mappedSubprocessOptions),
        transports: transports(mappedSubprocessOptions)
    };
    console.log(`libp2pOptions: ${JSON.stringify(libp2pOptionsParamsSet)}`);
    const peerIdOption = subprocessOptions.find((option) => option.name === 'id');
    if (peerIdOption?.value) {
        console.log(`peerIdOption: ${JSON.stringify(peerIdOption)}`);
        libp2pOptionsParamsSet.peerId = await libp2pPeerId(peerIdOption.value);
    }
    else if (libp2pOptionsParamsSet.peerId === undefined) {
        libp2pOptionsParamsSet.peerId = await libp2pPeerId();
    }
    const enablePrivateSwarm = subprocessOptions.find((option) => option.name === 'enablePrivateSwarm')?.value;
    if (enablePrivateSwarm === true) {
        libp2pOptionsParamsSet.connectionProtector = connectionProtector(subprocessOptions);
    }
    return libp2pOptionsParamsSet;
};
export { converMaptoList, convertListToMap, libp2pOptionsParams, buildSubProcesses };
