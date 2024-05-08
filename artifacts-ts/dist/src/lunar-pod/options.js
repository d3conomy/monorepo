import { InstanceOptions } from "../container/options.js";
import { defaultLibp2pOptions } from "../container-libp2p/options.js";
import { orbitDbOptions } from "../container-orbitdb/options.js";
import { openDbOptions } from "../container-orbitdb-open/options.js";
import { gossipSubOptions } from "../container-libp2p-pubsub/options.js";
import { ipfsFileSystemOptions } from "../container-ipfs-helia-filesystem/options.js";
const lunarPodOptions = () => {
    return new InstanceOptions({ options: [
            {
                name: "name",
                description: "Lunar Pod Name",
                required: false
            },
            // {
            //     name: 'containers',
            //     description: 'Containers in the Pod',
            //     required: false
            // } as InstanceOption<Array<Container>>,
            {
                name: 'podbayId',
                description: 'PodBay ID',
                required: true
            },
            ...defaultLibp2pOptions().toArray(),
            ...ipfsFileSystemOptions().toArray(),
            ...orbitDbOptions().toArray(),
            ...openDbOptions().toArray(),
            ...gossipSubOptions().toArray(),
            ...ipfsFileSystemOptions().toArray()
            // {
            //     name: 'podStackType',
            //     description: 'Pod Stack Type',
            //     required: true,
            //     defaultValue: 'database'
            // } as InstanceOption<string>,
            // {
            //     name: 'ipfsOptions',
            //     description: 'IPFS Options',
            //     required: true,
            //     defaultValue: new IpfsOptions()
            // } as InstanceOption<IpfsOptions>,
            // {
            //     name: 'libp2pOptions',
            //     description: 'Libp2p Options',
            //     required: true,
            //     defaultValue: defaultLibp2pOptions()
            // } as InstanceOption<Libp2pDefaultsOptions>,
            // {
            //     name: 'orbitDbOptions',
            //     description: 'OrbitDB Options',
            //     required: true,
            //     defaultValue: new OrbitDbOptions()
            // } as InstanceOption<Partial<OrbitDbOptions>>,
            // {
            //     name: 'openDbOptions',
            //     description: 'OpenDB Options',
            //     required: true,
            //     defaultValue: [new OpenDbOptions()]
            // } as InstanceOption<OpenDbOptions[]>,
            // {
            //     name: 'gossipSubOptions',
            //     description: 'GossipSub Options',
            //     required: true,
            //     defaultValue: new GossipSubOptions()
            // } as InstanceOption<Partial<OrbitDbOptions>>,
            // {
            //     name: 'ipfsFileSystemOptions',
            //     description: 'IPFS File System Options',
            //     required: true,
            //     defaultValue: new IpfsFileSystemOptions()
            // } as InstanceOption<Partial<OrbitDbOptions>>
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
