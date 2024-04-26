import { createLibp2p } from "libp2p";
import { Process, ProcessType, createProcessContainer } from "../process-interface/index.js";
import { buildSubProcesses, libp2pOptionsParams } from "./options.js";
import { libp2pCommands } from "./commands.js";
class Libp2pProcess extends Process {
    constructor({ id, process, options, commands }) {
        if (process?.process === undefined) {
            if (options === undefined) {
                options = libp2pOptionsParams();
            }
            const init = async (processOptions) => { return await createLibp2p(await buildSubProcesses(processOptions)); };
            process = createProcessContainer({
                type: ProcessType.LIBP2P,
                process,
                options,
                init
            });
        }
        super(id, process, commands ? commands : libp2pCommands);
    }
    async stop() {
        this.jobQueue.stop();
        this.process?.process?.stop();
    }
}
const createLibp2pProcess = async (id, options) => {
    const process = new Libp2pProcess({
        id,
        options,
        commands: libp2pCommands
    });
    await process.init();
    return process;
};
export { Libp2pProcess, createLibp2pProcess };
