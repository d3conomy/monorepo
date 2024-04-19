import { Libp2pOptions } from "libp2p";
import { IProcessOptions } from "../process-interface";
declare const libp2pOptions: () => IProcessOptions;
declare const buildSubProcesses: (options: IProcessOptions) => Promise<Libp2pOptions>;
export { buildSubProcesses, libp2pOptions };
//# sourceMappingURL=options.d.ts.map