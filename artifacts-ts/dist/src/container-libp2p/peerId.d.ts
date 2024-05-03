import { PeerId } from '@libp2p/interface';
import { InstanceOptions } from '../container/options.js';
declare const peerIdOptions: () => InstanceOptions;
/**
 * Create a PeerId
 * @category Libp2p
 */
declare const libp2pPeerId: (options: InstanceOptions) => Promise<PeerId>;
export { libp2pPeerId, peerIdOptions };
//# sourceMappingURL=peerId.d.ts.map