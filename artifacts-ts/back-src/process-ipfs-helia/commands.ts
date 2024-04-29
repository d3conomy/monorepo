import { HeliaLibp2p } from "helia"

import { IProcessCommand, IProcessCommandArgInput, ProcessType } from "../process-interface/index.js"
import { dagJson } from "@helia/dag-json"
import { CID } from "multiformats"
import { Libp2p } from "libp2p"




const ipfsCommands: Array<IProcessCommand> = [
    {
        name: 'start',
        type: ProcessType.IPFS,
        action: async (
            args: IProcessCommandArgInput[] = new Array<IProcessCommandArgInput>,
            instance: HeliaLibp2p<Libp2p>
        ): Promise<void> => {
            await instance.start()
        },
        args: []
    },
    {
        name: 'stop',
        type: ProcessType.IPFS,
        action: async (
            args: IProcessCommandArgInput[] = new Array<IProcessCommandArgInput>,
            instance: HeliaLibp2p<Libp2p>
        ): Promise<void> => {
            await instance.stop()
        },
        args: []
    },
    {
        name: 'addJson',
        type: ProcessType.IPFS,
        action: async (
            args: IProcessCommandArgInput[] = new Array<IProcessCommandArgInput>,
            instance: HeliaLibp2p<Libp2p>
        ): Promise<CID | undefined> => {
            let cid: CID | undefined = undefined
            try {
                const dj = dagJson(instance)
                cid = await dj.add(args[0].value);
            }
            catch (error: any) {
                throw error
            }
            return cid
        },
        args: []
    },
    {
        name: 'getJson',
        type: ProcessType.IPFS,
        action: async (
            args: IProcessCommandArgInput[] = new Array<IProcessCommandArgInput>,
            instance: HeliaLibp2p<Libp2p>
        ): Promise<any> => {
            let responseData: any;
            try {
                const dj = dagJson(instance)
                responseData = await dj.get(args[0].value);
            }
            catch (error: any) {
                throw error
            }
            return responseData
        },
        args: [
            {
                name: 'cid',
                description: 'The CID of the JSON data to get from IPFS',
                required: true
            }
        ]
    },
    {
        name: 'getLibp2p',
        type: ProcessType.IPFS,
        action: async (
            args: IProcessCommandArgInput[] = new Array<IProcessCommandArgInput>,
            instance: HeliaLibp2p<Libp2p>
        ): Promise<Libp2p> => {
            return instance.libp2p
        },
        args: []
    }
]

export {
    ipfsCommands
}