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
