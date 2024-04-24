import { Libp2pOptions } from "libp2p";
import { IProcessOption, ProcessOption, ProcessOptions } from "../process-interface/index.js";
declare const converMaptoList: (map: Map<string, any> | {
    [key: string]: any;
}) => Array<IProcessOption>;
declare const convertListToMap: (list: Array<IProcessOption>) => Map<IProcessOption['name'], IProcessOption>;
declare const libp2pOptionsParams: (options?: Array<IProcessOption>) => ProcessOptions;
declare const buildSubProcesses: (options?: Array<ProcessOption>) => Promise<Libp2pOptions>;
export { converMaptoList, convertListToMap, libp2pOptionsParams, buildSubProcesses };
//# sourceMappingURL=options.d.ts.map