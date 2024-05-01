import { createLibp2p, } from 'libp2p';
import { Container } from '../container/index.js';
import { InstanceTypes } from '../container/instance.js';
import { libp2pCommands } from './commands.js';
const libp2pInitializer = async (options) => {
    // const subProcessesses = await createSubProcesses(options);
    return await createLibp2p();
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
