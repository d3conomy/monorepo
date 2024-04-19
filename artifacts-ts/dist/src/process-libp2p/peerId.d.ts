import { PeerId } from '@libp2p/interface';
import { IProcessOptions } from '../process-interface/index.js';
declare const peerIdOptions: IProcessOptions;
/**
 * Create a PeerId
 * @category Libp2p
 */
declare const libp2pPeerId: ({ id }?: {
    id?: string | PeerId | undefined;
}) => Promise<PeerId | undefined>;
export { libp2pPeerId, peerIdOptions };
//# sourceMappingURL=peerId.d.ts.map