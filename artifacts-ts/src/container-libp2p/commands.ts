import { Libp2p } from 'libp2p';
import { peerIdFromString } from '@libp2p/peer-id';
import { PeerId, Libp2pStatus, Stream, type Connection } from '@libp2p/interface';

import { Command, CommandArg, Commands } from '../container/commands.js';
import { Multiaddr } from '@multiformats/multiaddr';

const commands: Commands = new Commands({ commands: [
    {
        name: 'start',
        description: 'Start the libp2p instance',
        run: async ({instance}: {instance: Libp2p}): Promise<void> => {
            await instance.start();
        }
    } as Command,
    {
        name: 'stop',
        description: 'Stop the libp2p instance',
        run: async ({instance}: {instance: Libp2p}): Promise<void> => {
            await instance.stop();
        }
    } as Command,
    {
        name: 'status',
        description: 'Get the status of the libp2p instance',
        run: async ({instance}: {instance: Libp2p}): Promise<Libp2pStatus> => {
            return instance.status;
        }
    } as Command,
    {
        name: 'peerId',
        description: 'Get the peer ID of the libp2p instance',
        run: async ({instance}: {instance: Libp2p}): Promise<PeerId> => {
            return instance.peerId;
        }
    } as Command,
    {
        name: 'multiaddrs',
        description: 'Get the multiaddresses of the libp2p instance',
        run: async ({instance}: {instance: Libp2p}): Promise<Multiaddr[]> => {
            return instance.getMultiaddrs();
        }
    } as Command,
    {
        name: 'peers',
        description: 'Get the peers of the libp2p instance',
        run: async ({instance}: {instance: Libp2p}): Promise<PeerId[]> => {
            return instance.getPeers();
        }
    } as Command,
    {
        name: 'connections',
        description: 'Get the connections of the libp2p instance',
        run: async ({args, instance}: {args: CommandArg<any>[], instance: Libp2p}): Promise<Connection[] | undefined> => {
            if (args) {
                const peerId = args.find(arg => arg.name === 'peerId')

                if (peerId) {
                    return instance.getConnections(peerIdFromString(peerId.value))
                }
            }
        },
        args: [
            {
                name: 'peerId',
                description: 'Peer ID',
                required: true
            } as CommandArg<string>
        ]
    } as Command,
    {
        name: 'protocols',
        description: 'Get the protocols of the libp2p instance',
        run: async ({instance}: {instance: Libp2p}): Promise<string[]> => {
            return instance.getProtocols();
        }
    } as Command,
    {
        name: 'listeners',
        description: 'Get the listeners of the libp2p instance',
        run: async ({args, instance}: {args: CommandArg<any>[], instance: Libp2p}): Promise<number> => {
            return instance.listenerCount(args?.find(arg => arg.name === 'eventName')?.value);
        },
        args: [
            {
                name: 'eventName',
                description: 'Event Name',
                required: true,
                defaultValue: "peer:connect"
            } as CommandArg<string>
        ]
    } as Command,
    {
        name: 'dial',
        description: 'Dial a peer',
        run: async ({args, instance}: {args: CommandArg<any>[], instance: Libp2p}): Promise<Connection> => {
            return await instance.dial(args?.find(arg => arg.name === 'peerId')?.value);
        },
        args: [
            {
                name: 'peerId',
                description: 'Peer ID',
                required: true
            } as CommandArg<string>
        ]
    } as Command,
    {
        name: 'hangup',
        description: 'Hang up a peer',
        run: async ({args, instance}: {args: CommandArg<any>[], instance: Libp2p}): Promise<void> => {
            return await instance.hangUp(args?.find(arg => arg.name === 'peerId')?.value);
        },
        args: [
            {
                name: 'peerId',
                description: 'Peer ID',
                required: true
            } as CommandArg<string>
        ]
    } as Command,
    {
        name: 'dialProtocol',
        description: 'Dial a protocol',
        run: async ({args, instance}: {args: CommandArg<any>[], instance: Libp2p}): Promise<Stream> => {
            return await instance.dialProtocol(
                args?.find(arg => arg.name === 'peerId')?.value,
                args?.find(arg => arg.name === 'protocol')?.value
            );
        },
        args: [
            {
                name: 'peerId',
                description: 'Peer ID',
                required: true
            } as CommandArg<string>,
            {
                name: 'protocol',
                description: 'Protocol',
                required: true
            } as CommandArg<string>
        ]
    } as Command
]})

export {
    commands as libp2pCommands
}