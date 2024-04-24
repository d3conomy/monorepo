import { IProcessOptionsList } from "../process-interface/index.js";
declare const connectionGaterOptions: IProcessOptionsList;
/**
 * Default Connection Gater libp2p options
 * @category Libp2p
 */
declare const connectionGater: ({ enableDenyDialMultiaddr, denyDialMultiaddr }?: {
    enableDenyDialMultiaddr?: boolean | undefined;
    denyDialMultiaddr?: boolean | undefined;
}) => any;
export { connectionGater, connectionGaterOptions };
//# sourceMappingURL=connectionGater.d.ts.map