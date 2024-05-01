import { InstanceOptions, createOptionsList } from "../container/options.js";
import { bootstrapOptions } from './bootstrap.js';
import { connectionEncryptionOptions } from "./connectionEncryption.js";
import { connectionGaterOptions } from "./connectionGater.js";
import { connectionProtectorOptions } from "./connectionProtector.js";
import { peerDiscoveryOptions } from "./peerDiscovery.js";
import { peerIdOptions } from "./peerId.js";
import { serviceOptions } from "./services.js";
import { streamMuxerOptions } from "./streamMuxers.js";
import { transportOptions } from "./transports.js";
const buildOptionsConfig = () => {
    return new InstanceOptions({ options: createOptionsList([
            {
                name: 'bootstrap',
                description: 'Bootstrap configuration',
                defaultValue: bootstrapOptions()
            },
            {
                name: 'transports',
                description: 'Transport configuration',
                defaultValue: transportOptions()
            },
            {
                name: 'peerId',
                description: 'PeerId configuration',
                defaultValue: peerIdOptions()
            },
            {
                name: 'streamMuxers',
                description: 'Stream Muxer configuration',
                defaultValue: streamMuxerOptions()
            },
            {
                name: 'connectionEncryption',
                description: 'Connection Encryption configuration',
                defaultValue: connectionEncryptionOptions()
            },
            {
                name: 'connectionGater',
                description: 'Connection Gater configuration',
                defaultValue: connectionGaterOptions()
            },
            {
                name: 'connectionProtector',
                description: 'Connection Protector configuration',
                defaultValue: connectionProtectorOptions()
            },
            {
                name: 'peerDiscovery',
                description: 'Peer Discovery configuration',
                defaultValue: peerDiscoveryOptions()
            },
            {
                name: 'services',
                description: 'Services configuration',
                defaultValue: serviceOptions()
            }
        ]) });
};
// const prepareOptions
