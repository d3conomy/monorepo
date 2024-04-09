import { LogLevel, ProcessType, logger } from 'd3-artifacts';
import { OrbitDbTypes } from '../open-db-process/OpenDbOptions.js';
import { Libp2pProcessConfig } from '../libp2p-process/processConfig.js';
import crypto from 'crypto';
import { createLibp2pProcessOptions } from '../libp2p-process/processOptions.js';
/**
 * The Moonbase authentication class
 * @category System
 */
class MoonbaseAuth {
    podBay;
    authDb;
    sessionDb;
    eventLog;
    constructor({ podBay }) {
        this.podBay = podBay;
    }
    async init() {
        logger({
            level: LogLevel.INFO,
            message: `Initializing MoonbaseAuth`
        });
        const swarmKeyRaw = crypto.randomBytes(32).toString('hex');
        logger({
            level: LogLevel.INFO,
            message: `Swarm key: ${swarmKeyRaw}`
        });
        const libp2pConfig = new Libp2pProcessConfig({
            enablePrivateSwarm: true,
            privateSwarmKey: swarmKeyRaw
        });
        const libp2pOptions = await createLibp2pProcessOptions({
            processConfig: libp2pConfig
        });
        // Create the database instance for authentication
        const orbitDbPodId = await this.podBay.newPod({
            podName: 'system',
            processType: ProcessType.ORBITDB,
            options: { libp2pOptions }
        });
        this.authDb = await this.podBay.openDb({
            podId: orbitDbPodId,
            dbName: 'system-auth',
            dbType: OrbitDbTypes.DOCUMENTS
        });
        // Create the database instance for session token storage
        this.sessionDb = await this.podBay.openDb({
            podId: orbitDbPodId,
            dbName: 'system-sessions',
            dbType: OrbitDbTypes.KEYVALUE
        });
        this.eventLog = await this.podBay.openDb({
            podId: orbitDbPodId,
            dbName: 'system-auth-events',
            dbType: OrbitDbTypes.EVENTS
        });
    }
}
export { MoonbaseAuth };
