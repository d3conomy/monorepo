import { dagJson } from "@helia/dag-json";
import { Commands } from "../container/commands.js";
const commands = new Commands({ commands: [
        {
            name: 'start',
            description: 'Start the libp2p instance',
            run: async ({ instance }) => {
                await instance.start();
            }
        },
        {
            name: 'stop',
            description: 'Stop the libp2p instance',
            run: async ({ instance }) => {
                await instance.stop();
            }
        },
        {
            name: 'addJson',
            description: 'Add JSON data to IPFS',
            run: async ({ args, instance }) => {
                const dj = dagJson(instance);
                return await dj.add(args[0].value);
            },
            args: [
                {
                    name: 'data',
                    description: 'The JSON data to add to IPFS'
                }
            ]
        },
        {
            name: 'getJson',
            description: 'Get JSON data from IPFS',
            run: async ({ args, instance }) => {
                const dj = dagJson(instance);
                return await dj.get(args[0].value);
            },
            args: [
                {
                    name: 'cid',
                    description: 'The CID of the JSON data to get from IPFS'
                }
            ]
        },
        {
            name: 'getLibp2p',
            description: 'Get the libp2p instance',
            run: async ({ instance }) => {
                return instance.libp2p;
            }
        }
    ] });
export { commands as ipfsCommands };
