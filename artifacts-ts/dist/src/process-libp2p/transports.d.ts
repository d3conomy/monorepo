import { IProcessOptionsList } from '../process-interface/index.js';
declare const transportOptions: IProcessOptionsList;
declare const transports: ({ enableWebSockets, enableWebTransport, enableTcp, enableWebRTC, enableCircuitRelayTransport, enableCircuitRelayTransportDiscoverRelays, }?: {
    enableWebSockets?: boolean | undefined;
    enableWebTransport?: boolean | undefined;
    enableTcp?: boolean | undefined;
    enableWebRTC?: boolean | undefined;
    enableCircuitRelayTransport?: boolean | undefined;
    enableCircuitRelayTransportDiscoverRelays?: number | undefined;
}) => Array<any>;
export { transports, transportOptions };
//# sourceMappingURL=transports.d.ts.map