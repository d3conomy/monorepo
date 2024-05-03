import { InstanceTypes } from '../container/instance.js';
import { Container } from '../container/index.js';
import { ContainerId } from '../id-reference-factory/index.js';
import { InstanceOptions } from '../container/options.js';
declare class GossipSubContainer extends Container<InstanceTypes.Pub_Sub> {
    constructor(id: ContainerId, options: InstanceOptions);
}
export { GossipSubContainer };
//# sourceMappingURL=index.d.ts.map