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
            if (options === undefined) {
                options = orbitDbOptions();
            }
            const init = async (processOptions) => {
                return await createOrbitDbInstance(processOptions);
            };
            container = createProcessContainer({
                type: ProcessType.ORBITDB,
                instance: undefined,
                options,
                init
            });
        }
        super(id, container, commands ? commands : orbitDbCommands);
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
