import { InstanceTypes } from '../container/instance.js';
import { Container } from '../container/index.js';
import { gossipSubCommands } from './commands.js';
const gossipSubInitializer = async (options) => {
    const libp2pContainer = options.get('libp2p');
    return libp2pContainer.getInstance().services?.pubsub;
};
class GossipSubContainer extends Container {
    constructor(id, options) {
        super({
            id,
            type: InstanceTypes.Pub_Sub,
            options,
            initializer: gossipSubInitializer,
            commands: gossipSubCommands
        });
    }
}
export { GossipSubContainer };
