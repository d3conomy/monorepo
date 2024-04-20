import { PodProcessId } from "../id-reference-factory";
import { IProcess, IProcessCommand, IProcessContainer, IProcessOption, Process } from "../process-interface/index.js";
declare class Libp2pProcess extends Process implements IProcess {
    constructor({ id, process, options, commands }: {
        id: PodProcessId;
        process?: IProcessContainer;
        options?: Array<IProcessOption>;
        commands: Array<IProcessCommand>;
    });
    stop(): Promise<void>;
}
export { Libp2pProcess };
//# sourceMappingURL=process.d.ts.map