import { ApiServer } from './moonbase-api-server/index.js';
import { Config } from './moonbase-config/MoonbaseConfig.js';
import { PodBay } from './pod-bay/index.js';
import { LogBooksManager, MoonbaseId } from 'd3-artifacts';
declare const systemId: any;
/**
 * The main class for the Moonbase
 * @category Moonbase
 */
declare class Moonbase {
    id: MoonbaseId;
    api: ApiServer;
    podBay: PodBay;
    config: Config;
    logs: LogBooksManager;
    private idReferenceFactory;
    constructor(config?: Config);
    /**
     * Initialize the Moonbase
     */
    init(): void;
}
/**
 * The main instance of the Moonbase
 * @category Moonbase
 */
declare const moonbase: Moonbase;
export { Moonbase, moonbase, systemId };
//# sourceMappingURL=index.d.ts.map