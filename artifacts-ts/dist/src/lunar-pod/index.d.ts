import { PodId } from '../id-reference-factory/IdReferenceClasses.js';
import { LunarPodOptions } from './options.js';
import { IdReferenceFactory } from '../id-reference-factory/IdReferenceFactory.js';
declare class Pod {
    private containers;
    private options;
    private readonly idReferenceFactory;
    readonly id: PodId;
    constructor(id: PodId, idReferenceFactory: IdReferenceFactory, options: LunarPodOptions);
    init(): Promise<void>;
}
export { Pod };
//# sourceMappingURL=index.d.ts.map