import { MoonbaseComponent } from "./component";
import { MoonbaseId } from "./id";
import { PodProcess } from "./process";

class Pod {
    public id: MoonbaseId;
    public processes: PodProcess[];

    public constructor({
        id,
        processes
    }: {
        id: MoonbaseId,
        processes: PodProcess[]
    }) {
        this.id = id ? id : new MoonbaseId({component: MoonbaseComponent.Pod});
        this.processes = processes;
    }
}

export {
    Pod
}