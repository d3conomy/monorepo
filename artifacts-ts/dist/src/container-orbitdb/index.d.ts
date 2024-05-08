import { ContainerId } from '../id-reference-factory/IdReferenceClasses.js';
import { InstanceOptions } from '../container/options.js';
import { Container } from '../container/index.js';
import { InstanceTypes } from '../container/instance.js';
/**
 * A class representing an OrbitDb process
 * @category OrbitDb
 */
declare class OrbitDbContainer extends Container<InstanceTypes.orbitdb> {
    constructor(id: ContainerId, options: InstanceOptions);
}
export { OrbitDbContainer };
//# sourceMappingURL=index.d.ts.map