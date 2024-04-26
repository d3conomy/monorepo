import { ProcessType } from "../process-interface/index.js";
import { dagJson } from "@helia/dag-json";
const ipfsCommands = [
    {
        name: 'start',
        type: ProcessType.IPFS,
        action: async (args = new Array, instance) => {
            await instance.start();
        },
        args: []
    },
    {
        name: 'stop',
        type: ProcessType.IPFS,
        action: async (args = new Array, instance) => {
            await instance.stop();
        },
        args: []
    },
    {
        name: 'addJson',
        type: ProcessType.IPFS,
        action: async (args = new Array, instance) => {
            let cid = undefined;
            try {
                const dj = dagJson(instance);
                cid = await dj.add(args[0].value);
            }
            catch (error) {
                throw error;
            }
            return cid;
        },
        args: []
    },
    {
        name: 'getJson',
        type: ProcessType.IPFS,
        action: async (args = new Array, instance) => {
            let responseData;
            try {
                const dj = dagJson(instance);
                responseData = await dj.get(args[0].value);
            }
            catch (error) {
                throw error;
            }
            return responseData;
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
        action: async (args = new Array, instance) => {
            return instance.libp2p;
        },
        args: []
    }
];
export { ipfsCommands };
