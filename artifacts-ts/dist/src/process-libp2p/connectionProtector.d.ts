import { ProtectorComponents } from '@libp2p/pnet';
import { ConnectionProtector } from '@libp2p/interface';
import { IProcessOptionsList } from '../process-interface/index.js';
declare const connectionProtectorOptions: () => IProcessOptionsList;
/**
 * Create a new pre-shared key for the swarm
 * @category Libp2p
 */
declare const createSwarmKey: (swarmKeyAsHex?: string) => Uint8Array;
/**
 * Create a connection protector using a pre-shared key
 * @category Libp2p
 */
declare function connectionProtector({ ...values }?: {}): (components: ProtectorComponents) => ConnectionProtector;
export { createSwarmKey, connectionProtector, connectionProtectorOptions };
//# sourceMappingURL=connectionProtector.d.ts.map