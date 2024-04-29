

import {
    Database,
    OrbitDBAccessController
} from '@orbitdb/core';
import { OpenDbOptions, openDbOptions } from './options.js';
import { OrbitDbProcess } from '../process-orbitdb/index.js';                                       
import { IProcess, IProcessCommand, IProcessContainer, IProcessOption, IProcessOptionsList, Process, ProcessStage, ProcessType, createProcessContainer, mapProcessOptions } from '../process-interface/index.js';
import { PodProcessId } from '../id-reference-factory/index.js';
import { openDbCommands } from './commands.js';
import { removeLock } from './helpers.js';
import { convertListToParams } from '../process-libp2p/options.js';


/**
 * Opens a database.
 * @category Database
 */
const openDb = async (
    instanceOptions: OpenDbOptions
): Promise<typeof Database> => {

    // const orbitDb = instanceOptions?.find(option => option.name === 'orbitDb')?.value as OrbitDbProcess;
    // const databaseName = instanceOptions?.find(option => option.name === 'databaseName')?.value as string;
    // const databaseType = instanceOptions?.find(option => option.name === 'databaseType')?.value as string;
    // const options = instanceOptions?.find(option => option.name === 'options')?.value as Map<string, string>;

    const orbitDb = instanceOptions.orbitDb
    const databaseName = instanceOptions.databaseName
    const databaseType = instanceOptions.databaseType
    const options = instanceOptions.dbOptions

    console.log(`opening database: ${databaseName}`)

    try {
        // await orbitDb.start();
        if (databaseName.startsWith('/orbitdb')) {
            return await orbitDb.container.instance.open(
                databaseName,
                {
                    type: databaseType,
                    sync: true,
                    AccessController: OrbitDBAccessController({
                        write: ['*']
                    })
                },
                // options?.entries()
            );
        }
        else {
            return await orbitDb.container.instance.open(
                databaseName,
                {
                    type: databaseType,
                    AccessController: OrbitDBAccessController({
                        write: ['*']
                    })
                },
                // options?.entries()
            );
        }
    }
    catch (error) {
        // logger({
        //     level: LogLevel.ERROR,
        //     message: `Error opening database: ${error}`
        // });
    }
}


class OpenDbProcess
    extends Process
    implements IProcess
{
    private processStatus: ProcessStage = ProcessStage.NEW;

    /**
     * Constructs a new instance of the OpenDb class.
     */
    constructor({
        id,
        container,
        options,
        commands
    }: {
        id: PodProcessId;
        container?: IProcessContainer;
        options?: OpenDbOptions;
        commands?: Array<IProcessCommand>;
    }) {
        if (container?.instance === undefined) {
            // if (options === undefined || options.length === 0) {
            //     options = openDbOptions();
            // }

            // const loadedOptions = new OpenDbOptions(convertListToParams(options));

            // console.log(`OpenDbOptions: ${loadedOptions.findOption('databaseName')?.value}`)

            // console.log(`OpenDbProcess loaded into constructor: ${loadedOptions.toArray()}`)

            const loadedOptions = options

            const init = async (
                processOptions: OpenDbOptions
            ): Promise<typeof Database> => {
                const dbName = processOptions.databaseName;
                console.log(`OpenDbProcess loaded into init: ${dbName}`)
                await removeLock( dbName, id.podId.name);
                return await openDb(processOptions);
            } 

            container = container !== undefined ? container : createProcessContainer<ProcessType.OPEN_DB>({
                type: ProcessType.OPEN_DB,
                instance: undefined,
                options: loadedOptions,
                init
            });
        }
        super(
            id,
            container,
            commands !== undefined ? commands : openDbCommands
        );
    }

    public async stop(): Promise<void> {
        this.jobQueue.stop();
        this.container?.instance?.close();
    }
}


const createOpenDbProcess = async (
    id: PodProcessId,
    options?: OpenDbOptions
): Promise<OpenDbProcess> => {
    const process = new OpenDbProcess({
        id,
        options,
        commands: openDbCommands
    });

    await process.init();

    return process;
}




export {
    createOpenDbProcess,
    OpenDbProcess,
    openDb,
}
