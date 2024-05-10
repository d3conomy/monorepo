import { LunarPod } from "../lunar-pod/index.js";
import { ContainerId, IdReferenceFactory, PodBayId, PodId } from "../id-reference-factory/index.js";
import { LunarPodOptions } from "../lunar-pod/options";
import { InstanceOptions } from "../container/options";
import { StackContainers } from "../lunar-pod/levels.js";
import { Command } from "../container/commands.js";
import { Container } from "../container/index.js";
import { InstanceTypes } from "../container/instance.js";


class PodBay {
    public id: PodBayId
    private idReferenceFactory: IdReferenceFactory;
    public pods: Array<LunarPod> = new Array<LunarPod>();

    constructor({
        id,
        pods,
        idReferenceFactory
    }:{
        id: PodBayId,
        pods?: Array<LunarPod>,
        idReferenceFactory: IdReferenceFactory
    }) {
        this.id = id;
        this.idReferenceFactory = idReferenceFactory;
        pods?.forEach(pod => {
            this.addPod(pod);
        });
    }

    private verifyPod(pod: LunarPod): boolean {
        // Currently allow only 10 pods per pod bay
        if (this.pods.length >= 10) {
            throw new Error('Pod bay already has 10 pods, create a new pod bay to add more pods');
        }
        return true;
    }

    public addPod(pod: LunarPod): LunarPod | undefined {
        if (this.verifyPod(pod)) {
            this.pods.push(pod);
            return pod;
        }
    }

    public async createPod({
        id,
        options,
        initialize = true
    }:{
        id: PodId,
        options: LunarPodOptions | InstanceOptions,
        initialize?: boolean
    }): Promise<LunarPod> {
        const pod = new LunarPod({
            id: id,
            options: options,
            idReferenceFactory: this.idReferenceFactory
        });
        this.addPod(pod);

        if (initialize) {
            await pod.init();
        }

        return pod;
    }

    public async initializePod(podId: PodId): Promise<void> {
        const pod = this.pods.find(pod => pod.id === podId);
        if (pod) {
            await pod.init();
        } else {
            throw new Error('Pod not found');
        }
    }

    public async stopPod(podId: PodId): Promise<void> {
        const pod = this.pods.find(pod => pod.id === podId);
        if (pod) {
            await pod.stop();
        } else {
            throw new Error('Pod not found');
        }
    }

    public async destroyPod(podId: PodId): Promise<void> {
        const pod = this.pods.find(pod => pod.id === podId);
        if (pod) {
            await pod.stop();
            this.pods = this.pods.filter(pod => pod.id !== podId);
        } else {
            throw new Error('Pod not found');
        }
    }

    public getContainer(containerId?: ContainerId | string, type?: InstanceTypes): StackContainers {
        let container: StackContainers | undefined = undefined;
        if (typeof containerId === 'string') {
            container = this.pods.map((pod: LunarPod) => pod.getContainer(containerId) !== undefined ? pod.getContainer(containerId) : undefined).find((container) => container !== undefined);
        }
        if (containerId instanceof ContainerId) {
            container = this.pods.map((pod) => pod.getContainer(containerId as ContainerId) !== undefined ? pod.getContainer(containerId as ContainerId) : undefined).find((container) => container !== undefined) ;
        }
        if (type !== undefined) {
            container = this.pods.map((pod) => pod.getContainerByType(type) !== undefined ? pod.getContainerByType(type) : undefined).find((container) => container !== undefined);
        }
        if (container === undefined) {
            throw new Error('Container not found');
        }
        return container;
    }

    public getCommand(
        command: string,
        containerId?: ContainerId | string
    ): Array<{
        container: ContainerId,
        command: Command
    }> {
        let containers: Array<Container> = new Array<Container>();
        if (containerId) {
            containers.push(this.getContainer(containerId));
        } else {
            const allContainers = this.pods.map(pod => pod.getContainers()).flat();
            allContainers.forEach(container => {
                containers.push(container as Container);
            });
        }

        let containerCommand: Array<{container: ContainerId, command: Command}> = new Array<{container: ContainerId, command: Command}>();
        for (const container of containers) {
            let foundCommand = container.commands.get(command);
            if (foundCommand !== undefined) {
                containerCommand.push({container: container.id, command: foundCommand});
            }
        }

        return containerCommand;
    }
}

export {
    PodBay
}