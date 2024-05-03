import { Commands } from '../container/commands.js';
const commands = new Commands({ commands: [
        {
            name: "start",
            description: "Start the pubsub process",
            run: async ({ instance }) => {
                await instance.start();
            }
        },
        {
            name: "stop",
            description: "Stop the pubsub process",
            run: async ({ instance }) => {
                await instance.stop();
            }
        },
        {
            name: "publish",
            description: "Publish a message to the pubsub topic",
            run: async ({ instance, args }) => {
                return await instance.publish(args[0].value, args[1].value);
            },
            args: [
                {
                    name: "topic",
                    description: "The topic to publish to",
                    required: true
                },
                {
                    name: "message",
                    description: "The message to publish",
                    required: true
                }
            ]
        },
        {
            name: "subscribe",
            description: "Subscribe to a pubsub topic",
            run: async ({ instance, args }) => {
                instance.addEventListener('message', (msg) => {
                    if (msg.detail.topic !== args[0].value) {
                        return;
                    }
                    console.log(`[${msg.detail.topic}] ${new TextDecoder().decode(msg.detail.data)}`);
                });
                instance.subscribe(args[0].value);
            },
            args: [
                {
                    name: "topic",
                    description: "The topic to subscribe to",
                    required: true
                }
            ]
        },
        {
            name: "unsubscribe",
            description: "Unsubscribe from a pubsub topic",
            run: async ({ instance, args }) => {
                instance.unsubscribe(args[0].value);
                instance.removeEventListener('message', (msg) => {
                    if (msg.detail.topic !== args[0].value) {
                        return;
                    }
                });
            },
            args: [
                {
                    name: "topic",
                    description: "The topic to unsubscribe from",
                    required: true
                }
            ]
        },
        {
            name: "subscriptions",
            description: "Get the list of pubsub topics subscribed to",
            run: async ({ instance }) => {
                return instance.getTopics();
            }
        },
        {
            name: "peers",
            description: "Get the list of pubsub peers",
            run: async ({ args, instance }) => {
                return instance.getSubscribers(args[0].value);
            },
            args: [
                {
                    name: "topic",
                    description: "The topic to get the list of peers for",
                    required: true
                }
            ]
        }
    ] });
export { commands as gossipSubCommands };
