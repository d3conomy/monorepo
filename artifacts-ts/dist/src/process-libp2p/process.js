import { createLibp2p } from "libp2p";
import { Process, ProcessType, compileProcessOptions, createProcessContainer } from "../process-interface/index.js";
import { buildSubProcesses, libp2pOptions } from "./options.js";
class Libp2pProcess extends Process {
    constructor({ id, process, options, commands }) {
        if (!process) {
            options = compileProcessOptions({ values: options, options: libp2pOptions() });
            const init = async () => { return await createLibp2p(await buildSubProcesses(options)); };
            process = createProcessContainer(ProcessType.LIBP2P, undefined, compileProcessOptions({ values: options, options: libp2pOptions() }), init);
        }
        super(id, process, commands);
    }
    async stop() {
        this.jobQueue.stop();
        this.process?.process.stop();
    }
}
export { Libp2pProcess };
