import { Libp2p } from 'libp2p';

import { IProcessCommand, IProcessCommandArg, IProcessCommandArgInput, ProcessType } from "../process-interface/index.js";
import { peerIdFromString } from '@libp2p/peer-id';

const commands: Array<IProcessCommand> = [
    {
        name: 'start',
        type: ProcessType.LIBP2P,
        action: async (args: IProcessCommandArgInput[] = new Array<IProcessCommandArgInput>, instance?: Libp2p): Promise<any> => {
            await instance?.start();
        },
        args: []
    },
    {
        name: 'stop',
        type: ProcessType.LIBP2P,
        action: async (args?: IProcessCommandArgInput[], instance?: Libp2p): Promise<any> => {
            await instance?.stop();
        },
        args: []
    },
    {
        name: 'status',
        type: ProcessType.LIBP2P,
        action: async (args?: IProcessCommandArgInput[], instance?: Libp2p): Promise<any> => {
            return instance?.status;
        },
        args: []
    },
    {
        name: 'peerId',
        type: ProcessType.LIBP2P,
        action: async (args?: IProcessCommandArgInput[], instance?: Libp2p): Promise<any> => {
            return instance?.peerId;
        },
        args: []
    },
    {
        name: 'multiaddrs',
        type: ProcessType.LIBP2P,
        action: async (args?: IProcessCommandArgInput[], instance?: Libp2p): Promise<any> => {
            return instance?.getMultiaddrs();
        },
        args: []
    },
    {
        name: 'peers',
        type: ProcessType.LIBP2P,
        action: async (args?: IProcessCommandArgInput[], instance?: Libp2p): Promise<any> => {
            return instance?.getPeers();
        },
        args: []
    },
    {
        name: 'connections',
        type: ProcessType.LIBP2P,
        action: async (args?: IProcessCommandArgInput[], instance?: Libp2p): Promise<any> => {
            if (args) {
                const peerId = args.find(arg => arg.name === 'peerId')

                if (peerId) {
                    return instance?.getConnections(peerIdFromString(peerId.value))
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
        action: async (args?: IProcessCommandArgInput[], instance?: Libp2p): Promise<any> => {
            return instance?.getProtocols();
        },
        args: []
    },
    {
        name: 'listeners',
        type: ProcessType.LIBP2P,
        action: async (args?: IProcessCommandArgInput[], instance?: Libp2p): Promise<any> => {
            return instance?.listenerCount(args?.find(arg => arg.name === 'eventName')?.value);
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
        action: async (args?: IProcessCommandArgInput[], instance?: Libp2p): Promise<any> => {
            return await instance?.dial(args?.find(arg => arg.name === 'peerId')?.value);
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
        action: async (args?: IProcessCommandArgInput[], instance?: Libp2p): Promise<any> => {
            return await instance?.hangUp(args?.find(arg => arg.name === 'peerId')?.value);
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
        action: async (args?: IProcessCommandArgInput[], instance?: Libp2p): Promise<any> => {
            return await instance?.dialProtocol(
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