import { InstanceOption, InstanceOptions } from "../container/options.js";

import { IpfsOptions } from "../container-ipfs-helia/options.js";
import { defaultLibp2pOptions } from "../container-libp2p/options.js";
import { OrbitDbOptions, orbitDbOptions } from "../container-orbitdb/options.js";
import { OpenDbOptions, openDbOptions } from "../container-orbitdb-open/options.js";
import { Container } from "../container/index.js";
import { PodBayId } from "../id-reference-factory/IdReferenceClasses.js";
import { Libp2pDefaultsOptions } from "helia/dist/src/utils/libp2p.js";
import { GossipSubOptions, gossipSubOptions } from "../container-libp2p-pubsub/options.js";
import { IpfsFileSystemOptions, ipfsFileSystemOptions } from "../container-ipfs-helia-filesystem/options.js";



const lunarPodOptions = (): InstanceOptions => {
    return new InstanceOptions({ options: [
        {
            name: "name",
            description: "Lunar Pod Name",
            required: false
        } as InstanceOption<string>,
        // {
        //     name: 'containers',
        //     description: 'Containers in the Pod',
        //     required: false
        // } as InstanceOption<Array<Container>>,
        {
            name: 'podbayId',
            description: 'PodBay ID',
            required: true
        } as InstanceOption<PodBayId>,
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
    ]})
}


class LunarPodOptions
    extends InstanceOptions
{

    constructor(options?: InstanceOptions, defaults: boolean = true) {
        super({
            options: options?.toArray(),
            injectDefaults: defaults,
            defaults: lunarPodOptions()

        })
    }
}

export {
    lunarPodOptions,
    LunarPodOptions
}
