import { InstanceOption, InstanceOptions, InstanceOptionsList, createOptionsList } from "../container/options.js";
import { bootstrapOptions } from './bootstrap.js';
import { connectionEncryptionOptions } from "./connectionEncryption.js";
import { connectionGaterOptions } from "./connectionGater.js";
import { connectionProtectorOptions } from "./connectionProtector.js";
import { peerDiscoveryOptions } from "./peerDiscovery.js";
import { peerIdOptions } from "./peerId.js";
import { serviceOptions } from "./services.js";
import { streamMuxerOptions } from "./streamMuxers.js";
import { transportOptions } from "./transports.js";

const buildOptionsConfig = (): InstanceOptions => {
    return new InstanceOptions({options: createOptionsList([
        {
            name: 'bootstrap',
            description: 'Bootstrap configuration',
            defaultValue: bootstrapOptions()
        } as InstanceOption<InstanceOptions>,
        {
            name: 'transports',
            description: 'Transport configuration',
            defaultValue: transportOptions()
        } as InstanceOption<InstanceOptions>,
        {
            name: 'peerId',
            description: 'PeerId configuration',
            defaultValue: peerIdOptions()
        } as InstanceOption<InstanceOptions>,
        {
            name: 'streamMuxers',
            description: 'Stream Muxer configuration',
            defaultValue: streamMuxerOptions()
        } as InstanceOption<InstanceOptions>,
        {
            name: 'connectionEncryption',
            description: 'Connection Encryption configuration',
            defaultValue: connectionEncryptionOptions()
        } as InstanceOption<InstanceOptions>,
        {
            name: 'connectionGater',
            description: 'Connection Gater configuration',
            defaultValue: connectionGaterOptions()
        } as InstanceOption<InstanceOptions>,
        {
            name: 'connectionProtector',
            description: 'Connection Protector configuration',
            defaultValue: connectionProtectorOptions()
        } as InstanceOption<InstanceOptions>,
        {
            name: 'peerDiscovery',
            description: 'Peer Discovery configuration',
            defaultValue: peerDiscoveryOptions()
        } as InstanceOption<InstanceOptions>,
        {
            name: 'services',
            description: 'Services configuration',
            defaultValue: serviceOptions()
        } as InstanceOption<InstanceOptions>
    ])})
}

// const prepareOptions

