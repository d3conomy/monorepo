import { ApiServer, ApiServerOptions } from './moonbase-api-server/index.js';
import { loadConfig } from './moonbase-config/MoonbaseConfig.js';
import { PodBay } from './pod-bay/index.js';
import { IdReferenceFactory, IdReferenceTypes, LogLevel, logBooksManager, logger, } from 'd3-artifacts';
const idReferenceFactory = new IdReferenceFactory();
const systemId = idReferenceFactory.createIdReference({
    type: IdReferenceTypes.SYSTEM
});
/**
 * The main class for the Moonbase
 * @category Moonbase
 */
class Moonbase {
    id;
    api;
    podBay;
    config;
    logs = logBooksManager;
    idReferenceFactory = idReferenceFactory;
    constructor(config) {
        this.id = this.idReferenceFactory.createIdReference({
            type: IdReferenceTypes.MOONBASE,
            dependsOn: systemId
        });
        this.config = config ? config : loadedConfig;
        loadedConfig = this.config;
        // this.logs.init();
        const podBayOptions = {
            nameType: this.config.general.names,
            pods: this.config?.pods,
        };
        const podBayId = this.idReferenceFactory.createIdReference({
            type: IdReferenceTypes.POD_BAY,
            dependsOn: this.id
        });
        this.podBay = new PodBay({
            id: podBayId,
            idReferenceFactory: this.idReferenceFactory,
            pods: podBayOptions.pods,
        });
        const options = new ApiServerOptions({
            port: this.config.api.port,
            podBay: this.podBay,
            corsOrigin: this.config.api.corsOrigin
        });
        if (!options) {
            const message = 'Failed to create ApiServerOptions';
            logger({
                level: LogLevel.ERROR,
                message
            });
            throw new Error(message);
        }
        this.api = new ApiServer(options);
    }
    /**
     * Initialize the Moonbase
     */
    init() {
        this.api.start();
    }
}
let loadedConfig = await loadConfig();
while (loadedConfig === null || loadedConfig === undefined) {
    setTimeout(() => {
        console.log('Waiting for config to load...');
    }, 100);
}
/**
 * The main instance of the Moonbase
 * @category Moonbase
 */
const moonbase = new Moonbase();
moonbase.init();
export { Moonbase, moonbase, systemId };
