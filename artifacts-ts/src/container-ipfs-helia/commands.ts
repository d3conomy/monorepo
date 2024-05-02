import { HeliaLibp2p } from "helia"
import { dagJson } from "@helia/dag-json"
import { CID } from "multiformats"
import { Libp2p } from "libp2p"

import { Command, CommandArg, Commands } from "../container/commands.js"


const commands: Commands = new Commands({ commands: [
    {
        name: 'start',
        description: 'Start the libp2p instance',
        run: async ({instance}: {instance: HeliaLibp2p<Libp2p>}): Promise<void> => {
            await instance.start()
        }
    } as Command,
    {
        name: 'stop',
        description: 'Stop the libp2p instance',
        run: async ({instance}: {instance: HeliaLibp2p<Libp2p>}) => {
            await instance.stop()
        }
    } as Command,
    {
        name: 'addJson',
        description: 'Add JSON data to IPFS',
        run: async ({args, instance}: {args: CommandArg<any>[], instance: HeliaLibp2p<Libp2p>}): Promise<CID> => {
            const dj = dagJson(instance)
            return await dj.add(args[0].value);
        },
        args: [
            {
                name: 'data',
                description: 'The JSON data to add to IPFS'
            } as CommandArg<any>
        ]
    } as Command,
    {
        name: 'getJson',
        description: 'Get JSON data from IPFS',
        run: async ({args, instance}: {args: CommandArg<any>[], instance: HeliaLibp2p<Libp2p>}): Promise<any> => {
            const dj = dagJson(instance)
            return await dj.get(args[0].value);
        },
        args: [
            {
                name: 'cid',
                description: 'The CID of the JSON data to get from IPFS'
            } as CommandArg<CID>
        ]
    } as Command,
    {
        name: 'getLibp2p',
        description: 'Get the libp2p instance',
        run: async ({instance}: {instance: HeliaLibp2p<Libp2p>}): Promise<Libp2p> => {
            return instance.libp2p
        }
    } as Command
]})

export {
    commands as ipfsCommands
}