import { InstanceOptions } from "../container/options";
const gossipSubOptions = () => {
    return new InstanceOptions({ options: [
            {
                name: 'libp2p',
                description: 'The libp2p container',
                required: true
            }
        ] });
};
export { gossipSubOptions };
