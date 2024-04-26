import { createOrbitDB } from '@orbitdb/core';
import { Process } from '../process-interface/process.js';
import { createProcessContainer } from '../process-interface/processContainer.js';
import { orbitDbOptions } from './options.js';
import { ProcessType } from '../process-interface/processTypes.js';
import { orbitDbCommands } from './commands.js';
import { createIdentityProvider } from './identityProvider.js';
/**
 * Create an OrbitDb process
 * @category OrbitDb
 */
const createOrbitDbInstance = async (instanceOptions) => {
    const ipfs = instanceOptions?.find(option => option.name === 'ipfs')?.value;
    const directory = instanceOptions?.find(option => option.name === 'directory')?.value;
    const enableDID = instanceOptions?.find(option => option.name === 'enableDID')?.value;
    const identityProvider = instanceOptions?.find(option => option.name === 'identityProvider')?.value;
    const identitySeed = instanceOptions?.find(option => option.name === 'identitySeed')?.value;
    if (enableDID) {
        return await createOrbitDB({
            ipfs: ipfs.container?.instance,
            identity: {
                provider: createIdentityProvider({ identityProvider, identitySeed })
            },
            directory: directory
        });
    }
    return await createOrbitDB({
        ipfs: ipfs.container?.instance,
        directory: directory
    });
};
/**
 * A class representing an OrbitDb process
 * @category OrbitDb
 */
class OrbitDbProcess extends Process {
    constructor({ id, container, options, commands }) {
        if (container?.instance === undefined) {
            if (options === undefined || options.length === 0) {
                options = orbitDbOptions();
            }
            const init = async (processOptions) => {
                return await createOrbitDbInstance(processOptions);
            };
            container = container ? container : createProcessContainer({
                type: ProcessType.ORBITDB,
                instance: undefined,
                options,
                init
            });
        }
        super(id, container, commands ? commands : orbitDbCommands);
    }
    // public async init(): Promise<void> {
    //     // await super.init()
    //     if (this.container.instance === undefined) {
    //         if (this.container.loadInstance !== undefined && typeof this.container.init === 'function') {
    //             this.container.loadInstance(await this.container.init(this.container?.options))
    //         }
    //     }
    // }
    async stop() {
        this.jobQueue.stop();
        this.container?.instance?.ipfs.libp2p.stop();
    }
}
const createOrbitDbProcess = async (id, options) => {
    const process = new OrbitDbProcess({
        id,
        options,
        commands: orbitDbCommands
    });
    await process.init();
    return process;
};
export { createOrbitDbProcess, OrbitDbProcess };
