import { Commands } from '../container/commands.js';
const commands = new Commands({ commands: [
        {
            name: "close",
            description: "Close a database",
            run: async ({ instance }) => {
                return await instance.close();
            }
        },
        {
            name: "address",
            description: "Get the address of a database",
            run: async ({ instance }) => {
                return instance.address;
            }
        },
        {
            name: "add",
            description: "Add data to a database",
            run: async ({ args, instance }) => {
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
            run: async ({ instance }) => {
                return await instance.all();
            }
        },
        {
            name: "get",
            description: "Get data from a database",
            run: async ({ args, instance }) => {
                // console.log(args.find((arg) => arg.name === "hash")?.value);
                return await instance.get(args.find((arg) => arg.name === "hash")?.value);
            },
            args: [
                {
                    name: "hash",
                    description: "The cid of the data to get from the database",
                    required: true
                }
            ]
        },
        {
            name: "put",
            description: "Put data into a database",
            run: async ({ args, instance }) => {
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
            run: async ({ args, instance }) => {
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
            run: async ({ args, instance }) => {
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
            run: async ({ args, instance }) => {
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
    ] });
export { commands as openDbCommands };
