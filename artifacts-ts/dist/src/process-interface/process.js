import { JobQueue } from "./processJobQueue";
import { ProcessStage } from "./processStages";
const createProcess = (id, process, commands) => {
    const jobQueue = new JobQueue();
    return {
        id,
        process,
        commands,
        jobQueue,
        check() {
            return this.process !== undefined;
        },
        status() {
            return this.jobQueue.isEmpty() ? ProcessStage.PENDING : ProcessStage.RUNNING;
        },
        async init() {
            this.jobQueue.init(commands);
        },
        async start() {
            await this.jobQueue.run();
        },
        async stop() {
            this.jobQueue.stop();
        },
        async restart() {
            await this.stop();
            await this.start();
        }
    };
};
// export {
//     IProcess
// }
