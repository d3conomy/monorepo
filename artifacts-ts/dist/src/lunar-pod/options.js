import { InstanceOptions } from "../container/options.js";
import { defaultLibp2pOptions } from "../container-libp2p/options.js";
import { OpenDbOptions } from "../container-orbitdb-open/options.js";
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
                name: 'ipfsOptions',
                description: 'IPFS Options',
                required: false,
                // defaultValue: 
            },
            {
                name: 'libp2pOptions',
                description: 'Libp2p Options',
                required: false,
                defaultValue: defaultLibp2pOptions()
            },
            {
                name: 'orbitDbOptions',
                description: 'OrbitDB Options',
                required: false,
                // defaultValue: 
            },
            {
                name: 'openDbOptions',
                description: 'OpenDB Options',
                required: false,
                defaultValue: new OpenDbOptions()
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
