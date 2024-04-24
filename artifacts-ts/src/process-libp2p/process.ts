import { Libp2p, createLibp2p } from "libp2p";
import { PodProcessId } from "../id-reference-factory";
import { IProcess, IProcessCommand, IProcessCommands, IProcessContainer, IProcessOption, IProcessOptionsList, JobQueue, Process, ProcessCommands, ProcessStage, ProcessType, compileProcessOptions, createProcessContainer } from "../process-interface/index.js";
import { buildSubProcesses, libp2pOptionsParams } from "./options.js";
import { libp2pCommands } from "./commands.js";

class Libp2pProcess extends Process implements IProcess {

    constructor ({
        id,
        process,
        options,
        commands
    }: {
        id: PodProcessId,
        process?: IProcessContainer,
        options?: Array<IProcessOption>,
        commands?: Array<IProcessCommand>
    }) {
        if (!process) {
            const init = async (processOptions: IProcessOptionsList | undefined): Promise<Libp2p> => { return await createLibp2p(await buildSubProcesses(processOptions)) }
            process = process? process : createProcessContainer<ProcessType.LIBP2P>({
                type: ProcessType.LIBP2P,
                process,
                options,
                init
            })
        }
        super(
            id, 
            process,
            commands ? commands : libp2pCommands
        )
    }

    public async stop(): Promise<void> {
        this.jobQueue.stop()
        this.process?.process?.stop()
    }
}

const createLibp2pProcess = async (
    id: PodProcessId,
    options: Array<IProcessOption>,
): Promise<Libp2pProcess> => {
    const process = new Libp2pProcess({
        id,
        options,
        commands: libp2pCommands
    })

    await process.init()

    return process
}

export {
    Libp2pProcess,
    createLibp2pProcess
}