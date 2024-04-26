import {
    OrbitDb,
    createOrbitDB,
    Database
} from '@orbitdb/core';

import { IProcess, Process } from '../process-interface/process.js';
import { PodProcessId } from '../id-reference-factory/IdReferenceClasses.js';
import { ProcessStage } from '../process-interface/processStages.js';
import { IProcessContainer, createProcessContainer } from '../process-interface/processContainer.js';
import { IProcessOption, IProcessOptionsList } from '../process-interface/processOptions.js';
import { IProcessCommand } from '../process-interface/processCommand.js';
import { orbitDbOptions } from './options.js';
import { ProcessType } from '../process-interface/processTypes.js';
import { orbitDbCommands } from './commands.js';
import { createIdentityProvider } from './identityProvider.js';
import { IpfsOptions } from '../process-ipfs-helia/options.js';
import { IpfsProcess } from '../process-ipfs-helia/process.js';


/**
 * Create an OrbitDb process
 * @category OrbitDb
 */
const createOrbitDbInstance = async (
    instanceOptions: IProcessOptionsList | undefined
): Promise<typeof OrbitDb> => {

    const ipfs = instanceOptions?.find(option => option.name === 'ipfs')?.value as IpfsProcess
    const directory = instanceOptions?.find(option => option.name === 'directory')?.value
    const enableDID = instanceOptions?.find(option => option.name === 'enableDID')?.value
    const identityProvider = instanceOptions?.find(option => option.name === 'identityProvider')?.value
    const identitySeed = instanceOptions?.find(option => option.name === 'identitySeed')?.value



    if (enableDID) {
        return await createOrbitDB({
            ipfs: ipfs.container?.instance,
            identity: {
                provider: createIdentityProvider({identityProvider, identitySeed})
            },
            directory: directory
        });
    }
    return await createOrbitDB({
        ipfs: ipfs.container?.instance,
        directory: directory
    });
}

/**
 * A class representing an OrbitDb process
 * @category OrbitDb
 */
class OrbitDbProcess
    extends Process
    implements IProcess
{

    constructor({
        id,
        container,
        options,
        commands
    }: {
        id: PodProcessId,
        container?: IProcessContainer,
        options?: Array<IProcessOption>,
        commands?: Array<IProcessCommand>
    }) {
        if (container?.instance === undefined) {
            if (options === undefined) {
                options = orbitDbOptions()
            }

            const init = async (
                processOptions: IProcessOptionsList | undefined
            ): Promise<typeof OrbitDb> => {
                return await createOrbitDbInstance(processOptions)
            }

            container = createProcessContainer<ProcessType.ORBITDB>({
                type: ProcessType.ORBITDB,
                instance: undefined,
                options,
                init
            })
        }
        super(
            id,
            container,
            commands ? commands : orbitDbCommands
        )
    }
}

const createOrbitDbProcess = async (
    id: PodProcessId,
    options?: Array<IProcessOption>,
): Promise<OrbitDbProcess> => {
    const process = new OrbitDbProcess({
        id,
        options,
        commands: orbitDbCommands
    })

    await process.init()

    return process
}

export {
    createOrbitDbProcess,
    OrbitDbProcess
}
