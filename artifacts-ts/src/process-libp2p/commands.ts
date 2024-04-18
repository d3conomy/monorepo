import { Libp2p } from 'libp2p';

import { ProcessCommands, createProcessCommand, createProcessCommandArgs } from "../process-interface/index.js";

const commands = [
    createProcessCommand({
        name: 'start',
        action: async (args, process: Libp2p) => {
            await process.start();
        }
    }),
    createProcessCommand({
        name: 'stop',
        action: async (args, process: Libp2p) => {
            await process.stop();
        }
    }),
    createProcessCommand({
        name: 'status',
        action: async (args, process: Libp2p) => {
            return process.status;
        }
    }),
    createProcessCommand({
        name: 'peerId',
        action: async (args, process: Libp2p) => {
            return process.peerId;
        }
    }),
    createProcessCommand({
        name: 'multiaddrs',
        action: async (args, process: Libp2p) => {
            return process.getMultiaddrs();
        }
    }),
    createProcessCommand({
        name: 'peers',
        action: async (args, process: Libp2p) => {
            return process.getPeers();
        }
    }),
    createProcessCommand({
        name: 'connections',
        action: async (args, process: Libp2p) => {
            return process.getConnections(args?.find(arg => arg.name === 'peerId')?.value);
        },
        args: [
            createProcessCommandArgs({
                name: 'peerId',
                description: 'Peer ID',
                required: true
            })
        ]
    }),
    createProcessCommand({
        name: 'protocols',
        action: async (args, process: Libp2p) => {
            return process.getProtocols();
        }
    }),
    createProcessCommand({
        name: 'listeners',
        action: async (args, process: Libp2p) => {
            return process.listenerCount(args?.find(arg => arg.name === 'eventName')?.value);
        },
        args: [
            createProcessCommandArgs({
                name: 'eventName',
                description: 'Event Name',
                required: true,
                defaultValue: "peer:connect"
            })
        ]
    }),
    createProcessCommand({
        name: 'dial',
        action: async (args, process: Libp2p) => {
            return process.dial(args?.find(arg => arg.name === 'peerId')?.value);
        },
        args: [
            createProcessCommandArgs({
                name: 'peerId',
                description: 'Peer ID',
                required: true
            })
        ]
    }),
    createProcessCommand({
        name: 'hangup',
        action: async (args, process: Libp2p) => {
            return process.hangUp(args?.find(arg => arg.name === 'peerId')?.value);
        },
        args: [
            createProcessCommandArgs({
                name: 'peerId',
                description: 'Peer ID',
                required: true
            })
        ]
    }),
    createProcessCommand({
        name: 'dialProtocol',
        action: async (args, process: Libp2p) => {
            return process.dialProtocol(
                args?.find(arg => arg.name === 'peerId')?.value,
                args?.find(arg => arg.name === 'protocol')?.value
            );
        },
        args: [
            createProcessCommandArgs({
                name: 'peerId',
                description: 'Peer ID',
                required: true
            }),
            createProcessCommandArgs({
                name: 'protocol',
                description: 'Protocol',
                required: true
            })
        ]
    })
]

const libp2pCommands = new ProcessCommands({
    commands
});

export {
    libp2pCommands
}