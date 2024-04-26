import { PodProcessId } from "../id-reference-factory";
import { IProcess, IProcessCommand, IProcessContainer, IProcessOption, Process } from "../process-interface/index.js";
declare class Libp2pProcess extends Process implements IProcess {
    constructor({ id, container, options, commands }: {
        id: PodProcessId;
        container?: IProcessContainer;
        options?: Array<IProcessOption>;
        commands?: Array<IProcessCommand>;
    });
    stop(): Promise<void>;
}
declare const createLibp2pProcess: (id: PodProcessId, options?: Array<IProcessOption>) => Promise<Libp2pProcess>;
export { Libp2pProcess, createLibp2pProcess };
//# sourceMappingURL=process.d.ts.map