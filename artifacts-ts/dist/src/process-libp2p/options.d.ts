import { Libp2pOptions } from "libp2p";
import { IProcessOptions } from "../process-interface/index.js";
declare const libp2pOptions: (inputOptions?: IProcessOptions) => IProcessOptions;
declare const buildSubProcesses: (options: any) => Promise<Libp2pOptions>;
export { buildSubProcesses, libp2pOptions };
//# sourceMappingURL=options.d.ts.map