import os from 'os';
import { ApiServer, ApiServerOptions } from '../moonbase-api-server/index.js';
import { loadConfig } from './MoonbaseConfig.js';
import { PodBay } from '../pod-bay/index.js';
import { IdReferenceFactory, IdReferenceTypes, LogLevel, logBooksManager, logger, } from 'd3-artifacts';
import { MoonbaseAuth } from './MoonbaseAuth.js';
// Analyze the system
const systemInfo = {
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
};
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
    auth;
    api;
    podBay;
    config;
    logs = logBooksManager;
    idReferenceFactory = idReferenceFactory;
    constructor(config) {
        this.id = this.idReferenceFactory.createIdReference({
            name: "system-moonbase",
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
            name: "system-pod-bay",
            type: IdReferenceTypes.POD_BAY,
            dependsOn: this.id
        });
        this.podBay = new PodBay({
            id: podBayId,
            idReferenceFactory: this.idReferenceFactory,
            pods: podBayOptions.pods,
        });
        this.auth = new MoonbaseAuth({
            podBay: this.podBay,
            swarmKey: this.config.auth.systemSwarmKey,
            authDbCid: this.config.auth.authDbCid,
            sessionDbCid: this.config.auth.sessionDbCid,
            eventLogCid: this.config.auth.eventLogCid
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
    async init() {
        this.api.start();
        this.auth.init();
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
await moonbase.init();
export { Moonbase, moonbase, systemId };
export { Config } from './MoonbaseConfig.js';
