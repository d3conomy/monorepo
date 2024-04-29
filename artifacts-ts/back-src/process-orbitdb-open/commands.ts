

import {
    Database
} from '@orbitdb/core';

import { IProcessCommand, IProcessCommandArgInput, ProcessType } from '../process-interface/index.js';


const openDbCommands: Array<IProcessCommand> = [
    {
        name: "close",
        description: "Close a database",
        type: ProcessType.OPEN_DB,
        action: async (
            args: IProcessCommandArgInput[] = new Array<IProcessCommandArgInput>,
            instance: typeof Database
        ): Promise<void> => {
            return await instance.close();
        },
        args: [
            {
                name: "databaseName",
                description: "The name of the database to close",
                required: true
            }
        ]
    },
    {
        name: "address",
        description: "Get the address of a database",
        type: ProcessType.OPEN_DB,
        action: async (
            args: IProcessCommandArgInput[] = new Array<IProcessCommandArgInput>,
            instance: typeof Database
        ): Promise<string> => {
            return instance.address();
        },
        args: []
    },
    {
        name: "add",
        description: "Add data to a database",
        type: ProcessType.OPEN_DB,
        action: async (
            args: IProcessCommandArgInput[] = new Array<IProcessCommandArgInput>,
            instance: typeof Database
        ): Promise<string> => {
            return await instance.add(args[0].value);
        },
        args: [
            {
                name: "data",
                description: "The data to add to the database",
                required: true
            }
        ]
    },
    {
        name: "all",
        description: "Get all data from a database",
        type: ProcessType.OPEN_DB,
        action: async (
            args: IProcessCommandArgInput[] = new Array<IProcessCommandArgInput>,
            instance: typeof Database
        ): Promise<any> => {
            return await instance.all();
        },
        args: []
    },
    {
        name: "get",
        description: "Get data from a database",
        type: ProcessType.OPEN_DB,
        action: async (
            args: IProcessCommandArgInput[] = new Array<IProcessCommandArgInput>,
            instance: typeof Database
        ): Promise<any> => {
            return await instance.get(args[0].value);
        },
        args: [
            {
                name: "hash",
                description: "The hash of the data to get from the database",
                required: true
            }
        ]
    },
    {
        name: "put",
        description: "Put data into a database",
        type: ProcessType.OPEN_DB,
        action: async (
            args: IProcessCommandArgInput[] = new Array<IProcessCommandArgInput>,
            instance: typeof Database
        ): Promise<string> => {
            return await instance.put(args[0].value, args[1].value);
        },
        args: [
            {
                name: "key",
                description: "The key to use when putting data into the database",
                required: true
            },
            {
                name: "value",
                description: "The value to put into the database",
                required: true
            }
        ]
    },
    {
        name: "putDoc",
        description: "Put a document into a database",
        type: ProcessType.OPEN_DB,
        action: async (
            args: IProcessCommandArgInput[] = new Array<IProcessCommandArgInput>,
            instance: typeof Database
        ): Promise<string> => {
            return await instance.putDoc(args[0].value);
        },
        args: [
            {
                name: "doc",
                description: "The document to put into the database",
                required: true
            }
        ]
    },
    {
        name: "del",
        description: "Delete data from a database",
        type: ProcessType.OPEN_DB,
        action: async (
            args: IProcessCommandArgInput[] = new Array<IProcessCommandArgInput>,
            instance: typeof Database
        ): Promise<void> => {
            return await instance.del(args[0].value);
        },
        args: [
            {
                name: "key",
                description: "The key of the data to delete from the database",
                required: true
            }
        ]
    },
    {
        name: "query",
        description: "Query a database",
        type: ProcessType.OPEN_DB,
        action: async (
            args: IProcessCommandArgInput[] = new Array<IProcessCommandArgInput>,
            instance: typeof Database
        ): Promise<any> => {
            return await instance.query(args[0].value);
        },
        args: [
            {
                name: "mapper",
                description: "The mapper function to use when querying the database",
                required: true
            }
        ]
    }
];



export {
    openDbCommands
};