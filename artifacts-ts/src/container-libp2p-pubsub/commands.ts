
import { PublishResult, PeerId } from '@libp2p/interface'
import { GossipSub } from '@chainsafe/libp2p-gossipsub';
import { Command, CommandArg, Commands } from '../container/commands.js';

const commands: Commands = new Commands({ commands:  [
    {
        name: "start",
        description: "Start the pubsub process",
        run: async ({instance}: {instance: GossipSub}): Promise<void> => {
            await instance.start();
        }
    } as Command,
    {
        name: "stop",
        description: "Stop the pubsub process",
        run: async ({instance}: {instance: GossipSub}): Promise<void> => {
            await instance.stop();
    }
    } as Command,
    {
        name: "publish",
        description: "Publish a message to the pubsub topic",
        run: async ({instance, args}: {instance: GossipSub, args: CommandArg<any>[]}): Promise<PublishResult> => {
            return await instance.publish(args[0].value, args[1].value);
        },
        args: [
            {
                name: "topic",
                description: "The topic to publish to",
                required: true
            } as CommandArg<string>,
            {
                name: "message",
                description: "The message to publish",
                required: true
            } as CommandArg<string>
        ]
    } as Command,
    {
        name: "subscribe",
        description: "Subscribe to a pubsub topic",
        run: async ({instance, args}: {instance: GossipSub, args: CommandArg<string>[]}): Promise<void> => {
            instance.addEventListener('message', (msg: any) => {
                if (msg.detail.topic !== args[0].value) {
                    return;
                }
                console.log(`[${msg.detail.topic}] ${new TextDecoder().decode(msg.detail.data)}`)
            })
            
            instance.subscribe(args[0].value as string);
        },
        args: [
            {
                name: "topic",
                description: "The topic to subscribe to",
                required: true
            } as CommandArg<string>
        ]
    } as Command,
    {
        name: "unsubscribe",
        description: "Unsubscribe from a pubsub topic",
        run: async ({instance, args}: {instance: GossipSub, args: CommandArg<string>[]}): Promise<void> => {
            instance.unsubscribe(args[0].value as string);

            instance.removeEventListener('message', (msg: any) => {
                if (msg.detail.topic !== args[0].value) {
                    return;
                }
            })
        },
        args: [
            {
                name: "topic",
                description: "The topic to unsubscribe from",
                required: true
            } as CommandArg<string>
        ]
    } as Command,
    {
        name: "subscriptions",
        description: "Get the list of pubsub topics subscribed to",
        run: async ({instance}: {instance: GossipSub}): Promise<string[]> => {
            return instance.getTopics();
    }
    } as Command,
    {
        name: "peers",
        description: "Get the list of pubsub peers",
        run: async ({args, instance}: {args: CommandArg<string>[], instance: GossipSub}): Promise<PeerId[]> => {
            return instance.getSubscribers(args[0].value as string);
        },
        args: [
            {
                name: "topic",
                description: "The topic to get the list of peers for",
                required: true
            } as CommandArg<string>
        ]

    } as Command
]});

export {
    commands as gossipSubCommands
};


