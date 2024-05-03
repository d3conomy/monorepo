import { OpenDbOptions } from './options.js';
import { ContainerId } from '../id-reference-factory/index.js';
import { Container } from '../container/index.js';
import { InstanceTypes } from '../container/instance.js';
declare class DatabaseContainer extends Container<InstanceTypes.Database> {
    /**
     * Constructs a new instance of the OpenDb class.
     */
    constructor(id: ContainerId, options: OpenDbOptions);
}
export { DatabaseContainer, };
//# sourceMappingURL=index.d.ts.map