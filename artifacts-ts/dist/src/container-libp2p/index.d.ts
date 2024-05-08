import { Container } from '../container/index.js';
import { InstanceOptions } from '../container/options.js';
import { InstanceTypes } from '../container/instance.js';
import { ContainerId } from '../id-reference-factory/IdReferenceClasses.js';
declare class Libp2pContainer extends Container<InstanceTypes.libp2p> {
    constructor(id: ContainerId, options?: InstanceOptions);
}
export { Libp2pContainer };
//# sourceMappingURL=index.d.ts.map