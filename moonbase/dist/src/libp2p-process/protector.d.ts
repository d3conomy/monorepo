import { ProtectorComponents } from '@libp2p/pnet';
import { ConnectionProtector } from '@libp2p/interface';
/**
 * Create a connection protector using a pre-shared key
 * @category Libp2p
 */
declare function connectionProtector({ swarmKeyAsHex }: {
    swarmKeyAsHex?: string;
}): (compnents: ProtectorComponents) => ConnectionProtector;
export { connectionProtector };
//# sourceMappingURL=protector.d.ts.map