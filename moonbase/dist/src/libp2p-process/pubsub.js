import { LogLevel, ProcessStage, logger } from 'd3-artifacts';
class GossipSubProcess {
    id;
    topic;
    process;
    constructor({ id, topic, libp2pProcess }) {
        this.id = id;
        this.topic = topic ? topic : 'moonbase-pubsub';
        this.process = libp2pProcess.process?.services?.pubsub;
    }
    checkProcess() {
        return true;
    }
    status() {
        return ProcessStage.STARTED;
    }
    async init() {
        await this.process.start();
        if (this.topic) {
            this.subscribe(this.topic);
        }
    }
    async start() {
        await this.process.start();
    }
    async stop() {
        await this.process.stop();
    }
    async restart() {
        await this.stop();
        await this.start();
    }
    subscribe(topic) {
        this.process.addEventListener('message', (msg) => {
            if (msg.detail.topic !== topic) {
                return;
            }
            logger({
                message: `[${msg.detail.topic}] ${new TextDecoder().decode(msg.detail.data)}`,
                level: LogLevel.INFO
            });
        });
        this.process.subscribe(topic);
    }
    getSubscriptions() {
        return this.process.getTopics();
    }
    async publish(message) {
        return await this.process.publish(this.topic, message);
    }
}
export { GossipSubProcess };
