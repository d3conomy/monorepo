import { ContainerId } from '../id-reference-factory/index.js';
import { Container } from '../container/index.js';
import { InstanceTypes } from '../container/instance.js';
import { InstanceOptions } from '../container/options.js';
declare class DatabaseContainer extends Container<InstanceTypes.database> {
    /**
     * Constructs a new instance of the OpenDb class.
     */
    constructor(id: ContainerId, options: InstanceOptions);
}
export { DatabaseContainer, };
//# sourceMappingURL=index.d.ts.map