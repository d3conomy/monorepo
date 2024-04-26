import { PeerId } from '@libp2p/interface';
import { IProcessOptionsList } from '../process-interface/index.js';
declare const peerIdOptions: () => IProcessOptionsList;
/**
 * Create a PeerId
 * @category Libp2p
 */
declare const libp2pPeerId: ({ ...values }?: {}) => Promise<PeerId | undefined>;
export { libp2pPeerId, peerIdOptions };
//# sourceMappingURL=peerId.d.ts.map