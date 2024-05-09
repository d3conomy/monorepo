import { Job } from "../container/jobs.js";
import { InstanceOptions } from "../container/options.js";
import { ContainerId, PodId } from "../id-reference-factory/IdReferenceClasses.js";
import { IdReferenceFactory } from "../id-reference-factory/IdReferenceFactory.js";
import { LunarPodOptions } from "./options.js";
import { Stack, Stacks } from "./stack.js";
declare class LunarPod {
    id: PodId;
    private options;
    private idReferenceFactory;
    private stacks;
    constructor({ id, options, idReferenceFactory, stacks }: {
        id: PodId;
        options: LunarPodOptions | InstanceOptions;
        idReferenceFactory: IdReferenceFactory;
        stacks?: Array<Stack>;
    });
    init(): Promise<void>;
    private verifyStack;
    addStack(stack: Stacks): Stacks | undefined;
    private createStack;
    private getStacks;
    private getContainers;
    createJob({ command, containerId, params }: {
        command: string;
        containerId: ContainerId;
        params: Array<{
            name: string;
            value: string;
        }>;
    }): Job;
    private queueJob;
    runJobs(): Promise<void>;
    stop(): Promise<void>;
}
export { LunarPod };
//# sourceMappingURL=index.d.ts.map