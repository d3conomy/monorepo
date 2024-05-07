import { InstanceOptions } from "../container/options.js";
const gossipSubOptions = () => {
    return new InstanceOptions({ options: [
            {
                name: 'libp2p',
                description: 'The libp2p container',
                required: true
            }
        ] });
};
class GossipSubOptions extends InstanceOptions {
    constructor(options, defaults = true) {
        super({ options: options?.toArray(), injectDefaults: defaults, defaults: gossipSubOptions() });
    }
}
export { gossipSubOptions, GossipSubOptions };
