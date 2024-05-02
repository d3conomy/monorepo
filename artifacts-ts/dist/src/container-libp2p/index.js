import { createLibp2p, } from 'libp2p';
import { Container } from '../container/index.js';
import { InstanceTypes } from '../container/instance.js';
import { libp2pCommands } from './commands.js';
import { createLibp2pOptions } from './options.js';
const libp2pInitializer = async (options) => {
    return await createLibp2p(await createLibp2pOptions(options));
};
class Libp2pContainer extends Container {
    constructor(id, options) {
        super({
            id,
            type: InstanceTypes.Libp2p,
            options: options,
            initializer: libp2pInitializer,
            commands: libp2pCommands
        });
    }
}
export { Libp2pContainer };
