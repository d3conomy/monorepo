import { InstanceOptions } from "../container/options.js";
import { IpfsOptions } from "../container-ipfs-helia/options.js";
import { defaultLibp2pOptions } from "../container-libp2p/options.js";
import { OrbitDbOptions } from "../container-orbitdb/options.js";
import { OpenDbOptions } from "../container-orbitdb-open/options.js";
import { GossipSubOptions } from "../container-libp2p-pubsub/options.js";
import { IpfsFileSystemOptions } from "../container-ipfs-helia-filesystem/options.js";
const lunarPodOptions = () => {
    return new InstanceOptions({ options: [
            {
                name: "name",
                description: "Lunar Pod Name",
                required: false
            },
            {
                name: 'containers',
                description: 'Containers in the Pod',
                required: false
            },
            {
                name: 'podbayId',
                description: 'PodBay ID',
                required: true
            },
            {
                name: 'podStackType',
                description: 'Pod Stack Type',
                required: true,
                defaultValue: 'database'
            },
            {
                name: 'ipfsOptions',
                description: 'IPFS Options',
                required: true,
                defaultValue: new IpfsOptions()
            },
            {
                name: 'libp2pOptions',
                description: 'Libp2p Options',
                required: true,
                defaultValue: defaultLibp2pOptions()
            },
            {
                name: 'orbitDbOptions',
                description: 'OrbitDB Options',
                required: true,
                defaultValue: new OrbitDbOptions()
            },
            {
                name: 'openDbOptions',
                description: 'OpenDB Options',
                required: true,
                defaultValue: [new OpenDbOptions()]
            },
            {
                name: 'gossipSubOptions',
                description: 'GossipSub Options',
                required: true,
                defaultValue: new GossipSubOptions()
            },
            {
                name: 'ipfsFileSystemOptions',
                description: 'IPFS File System Options',
                required: true,
                defaultValue: new IpfsFileSystemOptions()
            }
        ] });
};
class LunarPodOptions extends InstanceOptions {
    constructor(options, defaults = true) {
        super({
            options: options?.toArray(),
            injectDefaults: defaults,
            defaults: lunarPodOptions()
        });
    }
}
export { lunarPodOptions, LunarPodOptions };
