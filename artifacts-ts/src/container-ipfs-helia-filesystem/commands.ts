import { AddEvents, GetEvents, UnixFS, UnixFSStats, unixfs } from '@helia/unixfs'
import { CID } from 'multiformats'
import { Command, CommandArg, Commands } from '../container/commands.js'


const onEventProgress = (event: AddEvents | GetEvents) => {
    console.log(`IPFS file ${event.type} progress ${event.detail.toString()}`)
}


const commands: Commands = new Commands({ commands:  [
    {
        name: "addBytes",
        description: "Add a file to the IPFS file system",
        run: async ({instance, args}: {instance: UnixFS, args: CommandArg<Uint8Array | any>[]}): Promise<CID> => {
            const data = args.find(arg => arg.name === 'data')?.value as Uint8Array
            const onProgress = args.find(arg => arg.name === 'onProgress')?.value

            if (!data) {
                throw new Error('Data is required')
            }

            return await instance.addBytes(data, { onProgress: onProgress ? onProgress : onEventProgress });
        },
        args: [
            {
                name: "data",
                description: "The file data",
                required: true
            } as CommandArg<Uint8Array>,
            {
                name: "onProgress",
                description: "The progress event",
                required: false
            } as CommandArg<any>
        ]
    } as Command,
    {
        name: "getBytes",
        description: "Get a file from the IPFS file system",
        run: async ({instance, args}: {instance: UnixFS, args: CommandArg<CID | any>[]}): Promise<AsyncIterable<Uint8Array>> => {
            const cid = args.find(arg => arg.name === 'cid')?.value as CID
            const onProgress = args.find(arg => arg.name === 'onProgress')?.value

            if (!cid) {
                throw new Error('CID is required')
            }

            return instance.cat(cid, { onProgress: onProgress ? onProgress : onEventProgress });
        },
        args: [
            {
                name: "cid",
                description: "The content id",
                required: true
            } as CommandArg<CID>,
            {
                name: "onProgress",
                description: "The progress event",
                required: false
            } as CommandArg<any>
        ]
    } as Command,
    {
        name: "addFile",
        description: "Add a File to the IPFS file system",
        run: async ({instance, args}: {instance: UnixFS, args: CommandArg<any>[]}): Promise<CID> => {

            const data = args.find(arg => arg.name === 'data')?.value
            const path = args.find(arg => arg.name === 'path')?.value
            const mode = args.find(arg => arg.name === 'mode')?.value
            const onProgress = args.find(arg => arg.name === 'onProgress')?.value

            return await instance.addFile({
                content: data,
                path: path,
                mode: mode || 0x755,
                mtime: {
                    secs: 10n,
                    nsecs: 0
                }
            }, { onProgress: onProgress ? onProgress : onEventProgress });

        },
        args: [
            {
                name: "data",
                description: "The File data",
                required: true
            } as CommandArg<any>,
            {
                name: "path",
                description: "The file path",
                required: true
            } as CommandArg<string>,
            {
                name: "mode",
                description: "The file mode",
                required: false
            } as CommandArg<number>,
            {
                name: "onProgress",
                description: "The progress event",
                required: false
            } as CommandArg<any>
        ]
    } as Command,
    {
        name: "addDirectory",
        description: "Add a directory to the IPFS file system",
        run: async ({instance, args}: {instance: UnixFS, args: CommandArg<any>[]}): Promise<CID> => {
            return await instance.addDirectory(args[0].value);
        },
        args: [
            {
                name: "path",
                description: "The directory path",
                required: true
            } as CommandArg<string>,
            {
                name: "mode",
                description: "The file mode",
                required: false
            } as CommandArg<number>,
            {
                name: "onProgress",
                description: "The progress event",
                required: false
            } as CommandArg<any>
        ]
    } as Command,
    {
        name: "makeDirectory",
        description: "Make a new directory in the IPFS file system",
        run: async ({instance, args}: {instance: UnixFS, args: CommandArg<any>[]}): Promise<CID> => {
            const cid = args.find(arg => arg.name === 'cid')?.value
            const path = args.find(arg => arg.name === 'path')?.value
            const onProgress = args.find(arg => arg.name === 'onProgress')?.value


            return await instance.mkdir(path, path, { onProgress: onProgress ? onProgress : onEventProgress });
        },
        args: [
            {
                name: "cid",
                description: "The content id",
                required: true
            } as CommandArg<CID>,
            {
                name: "path",
                description: "The directory path",
                required: true
            } as CommandArg<string>,
            {
                name: "onProgress",
                description: "The progress event",
                required: false
            } as CommandArg<any>
        ]
    } as Command,
    {
        name: "listDirectory",
        description: "List the contents of a directory in the IPFS file system",
        run: async ({instance, args}: {instance: UnixFS, args: CommandArg<any>[]}): Promise<AsyncIterable<any>> => {
            const cid = args.find(arg => arg.name === 'cid')?.value
            const onProgress = args.find(arg => arg.name === 'onProgress')?.value

            return instance.ls(cid, { onProgress: onProgress ? onProgress : onEventProgress });
        },
        args: [
            {
                name: "cid",
                description: "The content id",
                required: true
            } as CommandArg<CID>,
            {
                name: "onProgress",
                description: "The progress event",
                required: false
            } as CommandArg<any>
        ]
    } as Command,
    {
        name: "stat",
        description: "Get the stats of a file in the IPFS file system",
        run: async ({instance, args}: {instance: UnixFS, args: CommandArg<any>[]}): Promise<UnixFSStats> => {
            const cid = args.find(arg => arg.name === 'cid')?.value
            const onProgress = args.find(arg => arg.name === 'onProgress')?.value

            return await instance.stat(cid, { onProgress: onProgress ? onProgress : onEventProgress });
        },
        args: [
            {
                name: "cid",
                description: "The content id",
                required: true
            } as CommandArg<CID>,
            {
                name: "onProgress",
                description: "The progress event",
                required: false
            } as CommandArg<any>
        ]
    } as Command,
    {
        name: "remove",
        description: "Remove a file from the IPFS file system",
        run: async ({instance, args}: {instance: UnixFS, args: CommandArg<any>[]}): Promise<CID> => {
            const cid = args.find(arg => arg.name === 'cid')?.value
            const path = args.find(arg => arg.name === 'path')?.value
            const onProgress = args.find(arg => arg.name === 'onProgress')?.value

            return await instance.rm(
                cid,
                path,
                { onProgress: onProgress ? onProgress : onEventProgress }
            );
        },
        args: [
            {
                name: "cid",
                description: "The content id",
                required: true
            } as CommandArg<CID>,
            {
                name: "path",
                description: "The file path",
                required: true
            } as CommandArg<string>,
            {
                name: "onProgress",
                description: "The progress event",
                required: false
            } as CommandArg<any>
        ]
    } as Command,
    {
        name: "touch",
        description: "Create a new Empty file in the IPFS file system",
        run: async ({instance, args}: {instance: UnixFS, args: CommandArg<any>[]}): Promise<CID> => {
            const cid = args.find(arg => arg.name === 'cid')?.value
            const path = args.find(arg => arg.name === 'path')?.value
            const mode = args.find(arg => arg.name === 'mode')?.value
            const mtime = args.find(arg => arg.name === 'mtime')?.value
            const onProgress = args.find(arg => arg.name === 'onProgress')?.value

            return await instance.touch(
                cid, 
                {
                    path: path,
                    mtime: mtime || {
                        secs: 10n,
                        nsecs: 0
                    },
                    onProgress: onProgress ? onProgress : onEventProgress
                }
            );
        },
        args: [
            {
                name: "cid",
                description: "The content id",
                required: true
            } as CommandArg<CID>,
            {
                name: "path",
                description: "The file path",
                required: true
            } as CommandArg<string>,
            {
                name: "mtime",
                description: "The file modification time",
                required: false
            } as CommandArg<any>,
            {
                name: "onProgress",
                description: "The progress event",
                required: false
            } as CommandArg<any>
        ]
    } as Command,
    {
        name: "chmod",
        description: "Chandge the file mode in the IPFS file system",
        run: async ({instance, args}: {instance: UnixFS, args: CommandArg<any>[]}): Promise<CID> => {
            const cid = args.find(arg => arg.name === 'cid')?.value
            const mode = args.find(arg => arg.name === 'mode')?.value
            const onProgress = args.find(arg => arg.name === 'onProgress')?.value

            return await instance.chmod(
                cid,
                mode,
                { onProgress: onProgress ? onProgress : onEventProgress }
            );
        },
        args: [
            {
                name: "cid",
                description: "The content id",
                required: true
            } as CommandArg<CID>,
            {
                name: "mode",
                description: "The file mode",
                required: true
            } as CommandArg<number>,
            {
                name: "onProgress",
                description: "The progress event",
                required: false
            } as CommandArg<any>
        ]
    } as Command
]})

export {
    commands as ipfsFileSystemCommands,
}