import { Libp2p } from 'libp2p';

import { IProcessCommand, IProcessCommandArg, IProcessCommandArgInput, ProcessType } from "../process-interface/index.js";
import { peerIdFromString } from '@libp2p/peer-id';

const commands: Array<IProcessCommand> = [
    {
        name: 'start',
        type: ProcessType.LIBP2P,
        action: async (args: IProcessCommandArgInput[] = new Array<IProcessCommandArgInput>, process?: Libp2p): Promise<any> => {
            await process?.start();
        },
        args: []
    },
    {
        name: 'stop',
        type: ProcessType.LIBP2P,
        action: async (args?: IProcessCommandArgInput[], process?: Libp2p): Promise<any> => {
            await process?.stop();
        },
        args: []
    },
    {
        name: 'status',
        type: ProcessType.LIBP2P,
        action: async (args?: IProcessCommandArgInput[], process?: Libp2p) => {
            return process?.status;
        },
        args: []
    },
    {
        name: 'peerId',
        type: ProcessType.LIBP2P,
        action: async (args?: IProcessCommandArgInput[], process?: Libp2p) => {
            return process?.peerId;
        },
        args: []
    },
    {
        name: 'multiaddrs',
        type: ProcessType.LIBP2P,
        action: async (args?: IProcessCommandArgInput[], process?: Libp2p) => {
            return process?.getMultiaddrs();
        },
        args: []
    },
    {
        name: 'peers',
        type: ProcessType.LIBP2P,
        action: async (args?: IProcessCommandArgInput[], process?: Libp2p) => {
            return process?.getPeers();
        },
        args: []
    },
    {
        name: 'connections',
        type: ProcessType.LIBP2P,
        action: async (args?: IProcessCommandArgInput[], process?: Libp2p) => {
            if (args) {
                const peerId = args.find(arg => arg.name === 'peerId')

                if (peerId) {
                    return process?.getConnections(peerIdFromString(peerId.value))
                }
            }
        },
        args: [
            {
                name: 'peerId',
                description: 'Peer ID',
                required: true
            }
        ]
    },
    {
        name: 'protocols',
        type: ProcessType.LIBP2P,
        action: async (args?: IProcessCommandArgInput[], process?: Libp2p) => {
            return process?.getProtocols();
        },
        args: []
    },
    {
        name: 'listeners',
        type: ProcessType.LIBP2P,
        action: async (args?: IProcessCommandArgInput[], process?: Libp2p) => {
            return process?.listenerCount(args?.find(arg => arg.name === 'eventName')?.value);
        },
        args: [
            {
                name: 'eventName',
                description: 'Event Name',
                required: true,
                default: "peer:connect"
            }
        ]
    },
    {
        name: 'dial',
        type: ProcessType.LIBP2P,
        action: async (args?: IProcessCommandArgInput[], process?: Libp2p) => {
            return process?.dial(args?.find(arg => arg.name === 'peerId')?.value);
        },
        args: [
            {
                name: 'peerId',
                description: 'Peer ID',
                required: true
            }
        ]
    },
    {
        name: 'hangup',
        type: ProcessType.LIBP2P,
        action: async (args?: IProcessCommandArgInput[], process?: Libp2p) => {
            return process?.hangUp(args?.find(arg => arg.name === 'peerId')?.value);
        },
        args: [
            {
                name: 'peerId',
                description: 'Peer ID',
                required: true
            }
        ]
    },
    {
        name: 'dialProtocol',
        type: ProcessType.LIBP2P,
        action: async (args?: IProcessCommandArgInput[], process?: Libp2p) => {
            return process?.dialProtocol(
                args?.find(arg => arg.name === 'peerId')?.value,
                args?.find(arg => arg.name === 'protocol')?.value
            );
        },
        args: [
            {
                name: 'peerId',
                description: 'Peer ID',
                required: true
            },
            {
                name: 'protocol',
                description: 'Protocol',
                required: true
            }
        ]
    }
]

// const libp2pCommands = new ProcessCommands({
//     commands
// });

export {
    commands as libp2pCommands
}