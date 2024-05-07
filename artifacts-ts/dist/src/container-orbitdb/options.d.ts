import { InstanceOptions } from '../container/options.js';
declare const orbitDbOptions: () => InstanceOptions;
/**
* The options for creating an OrbitDb process
* @category OrbitDb
*/
declare class OrbitDbOptions extends InstanceOptions {
    constructor(options?: InstanceOptions, defaults?: boolean);
    init(): void;
}
export { orbitDbOptions, OrbitDbOptions };
//# sourceMappingURL=options.d.ts.map