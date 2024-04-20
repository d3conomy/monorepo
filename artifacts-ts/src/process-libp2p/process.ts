import { Libp2p, createLibp2p } from "libp2p";
import { PodProcessId } from "../id-reference-factory";
import { IProcess, IProcessCommand, IProcessCommands, IProcessContainer, IProcessOption, JobQueue, Process, ProcessCommands, ProcessStage, ProcessType, compileProcessOptions, createProcessContainer, formatProcessOptions } from "../process-interface/index.js";
import { buildSubProcesses, libp2pOptions } from "./options.js";

class Libp2pProcess extends Process implements IProcess {

    constructor({
        id,
        process,
        options,
        commands
    }: {
        id: PodProcessId,
        process?: IProcessContainer,
        options?: Array<IProcessOption>,
        commands: Array<IProcessCommand>
    }) {
        if (!process) {
            options = compileProcessOptions({values: options, options: libp2pOptions()})
            const init = async (): Promise<any> => { return await createLibp2p(await buildSubProcesses(options)) }
            process = createProcessContainer<ProcessType.LIBP2P>(
                ProcessType.LIBP2P,
                undefined,
                compileProcessOptions({values: options, options: libp2pOptions()}),
                init
            )
        }
        super(
            id, 
            process,
            commands
        )
    }

    public async stop(): Promise<void> {
        this.jobQueue.stop()
        this.process?.process.stop()
    }
}

export {
    Libp2pProcess
}