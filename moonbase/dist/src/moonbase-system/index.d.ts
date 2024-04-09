import { ApiServer } from '../moonbase-api-server/index.js';
import { Config } from '../moonbase-config/MoonbaseConfig.js';
import { PodBay } from '../pod-bay/index.js';
import { LogBooksManager, MoonbaseId } from 'd3-artifacts';
import { MoonbaseAuth } from './MoonbaseAuth.js';
declare const systemId: any;
/**
 * The main class for the Moonbase
 * @category Moonbase
 */
declare class Moonbase {
    id: MoonbaseId;
    auth: MoonbaseAuth;
    api: ApiServer;
    podBay: PodBay;
    config: Config;
    logs: LogBooksManager;
    private idReferenceFactory;
    constructor(config?: Config);
    /**
     * Initialize the Moonbase
     */
    init(): Promise<void>;
}
/**
 * The main instance of the Moonbase
 * @category Moonbase
 */
declare const moonbase: Moonbase;
export { Moonbase, moonbase, systemId };
//# sourceMappingURL=index.d.ts.map