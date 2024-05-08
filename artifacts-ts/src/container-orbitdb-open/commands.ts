

import {
    Database
} from '@orbitdb/core';

import { Command, CommandArg, Commands } from '../container/commands.js';


const commands: Commands = new Commands({ commands:  [
    {
        name: "close",
        description: "Close a database",
        run: async ({instance}: {instance: typeof Database}): Promise<void> => {
            return await instance.close();
        }
    } as Command,
    {
        name: "address",
        description: "Get the address of a database",
        run: async ({instance}: {instance: typeof Database}): Promise<string> => {
            return instance.address;
        }
    } as Command,
    {
        name: "add",
        description: "Add data to a database",
        run: async ({args, instance}: {args: CommandArg<any>[], instance: typeof Database}): Promise<string> => {
            return await instance.add(args[0].value);
        },
        args: [
            {
                name: "data",
                description: "The data to add to the database",
                required: true
            } as CommandArg<any>
        ]
    } as Command,
    {
        name: "all",
        description: "Get all data from a database",
        run: async ({instance}: {instance: typeof Database}): Promise<any> => {
            return await instance.all();
        }
    } as Command,
    {
        name: "get",
        description: "Get data from a database",
        run: async ({args, instance}: {args: CommandArg<any>[], instance: typeof Database}): Promise<any> => {
            // console.log(args.find((arg) => arg.name === "hash")?.value);
            return await instance.get(args.find((arg) => arg.name === "hash" || "key")?.value);
        },
        args: [
            {
                name: "hash",
                description: "The cid of the data to get from the database",
                required: true
            } as CommandArg<string>,
            {
                name: "key",
                description: "The key of the data to get from the database",
                required: false
            } as CommandArg<string>
        ]
    } as Command,
    {
        name: "put",
        description: "Put data into a database",
        run: async ({args, instance}: {args: CommandArg<any>[], instance: typeof Database}): Promise<string> => {
            return await instance.put(args[0].value, args[1].value);
        },
        args: [
            {
                name: "key",
                description: "The key to use when putting data into the database",
                required: true
            } as CommandArg<string>,
            {
                name: "value",
                description: "The value to put into the database",
                required: true
            } as CommandArg<any>
        ]
    } as Command,
    {
        name: "putDoc",
        description: "Put a document into a database",
        run: async ({args, instance}: {args: CommandArg<any>[], instance: typeof Database}): Promise<string> => {
            return await instance.putDoc(args[0].value);
        },
        args: [
            {
                name: "doc",
                description: "The document to put into the database",
                required: true
            }
        ]
    } as Command,
    {
        name: "del",
        description: "Delete data from a database",
        run: async ({args, instance}: {args: CommandArg<any>[], instance: typeof Database}): Promise<void> => {
            return await instance.del(args[0].value);
        },
        args: [
            {
                name: "key",
                description: "The key of the data to delete from the database",
                required: true
            } as CommandArg<string>
        ]
    } as Command,
    {
        name: "query",
        description: "Query a database",
        run: async ({args, instance}: {args: CommandArg<any>[], instance: typeof Database}): Promise<any> => {
            return await instance.query(args[0].value);
        },
        args: [
            {
                name: "mapper",
                description: "The mapper function to use when querying the database",
                required: true
            } as CommandArg<any>
        ]
    } as Command
]});



export {
    commands as openDbCommands
};