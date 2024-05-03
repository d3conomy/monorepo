import { peerIdFromString } from '@libp2p/peer-id';
import { Commands } from '../container/commands.js';
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
            name: 'status',
            description: 'Get the status of the libp2p instance',
            run: async ({ instance }) => {
                return instance.status;
            }
        },
        {
            name: 'peerId',
            description: 'Get the peer ID of the libp2p instance',
            run: async ({ instance }) => {
                return instance.peerId;
            }
        },
        {
            name: 'multiaddrs',
            description: 'Get the multiaddresses of the libp2p instance',
            run: async ({ instance }) => {
                return instance.getMultiaddrs();
            }
        },
        {
            name: 'peers',
            description: 'Get the peers of the libp2p instance',
            run: async ({ instance }) => {
                return instance.getPeers();
            }
        },
        {
            name: 'connections',
            description: 'Get the connections of the libp2p instance',
            run: async ({ args, instance }) => {
                if (args) {
                    const peerId = args.find(arg => arg.name === 'peerId');
                    if (peerId) {
                        return instance.getConnections(peerIdFromString(peerId.value));
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
            description: 'Get the protocols of the libp2p instance',
            run: async ({ instance }) => {
                return instance.getProtocols();
            }
        },
        {
            name: 'listeners',
            description: 'Get the listeners of the libp2p instance',
            run: async ({ args, instance }) => {
                return instance.listenerCount(args?.find(arg => arg.name === 'eventName')?.value);
            },
            args: [
                {
                    name: 'eventName',
                    description: 'Event Name',
                    required: true,
                    defaultValue: "peer:connect"
                }
            ]
        },
        {
            name: 'dial',
            description: 'Dial a peer',
            run: async ({ args, instance }) => {
                return await instance.dial(args?.find(arg => arg.name === 'peerId')?.value);
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
            description: 'Hang up a peer',
            run: async ({ args, instance }) => {
                return await instance.hangUp(args?.find(arg => arg.name === 'peerId')?.value);
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
            description: 'Dial a protocol',
            run: async ({ args, instance }) => {
                return await instance.dialProtocol(args?.find(arg => arg.name === 'peerId')?.value, args?.find(arg => arg.name === 'protocol')?.value);
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
    ] });
export { commands as libp2pCommands };
