import { LogLevel, ProcessType, logger } from 'd3-artifacts';
import { OrbitDbTypes } from '../open-db-process/OpenDbOptions.js';
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
        // Create the database instance for authentication
        const orbitDbPodId = await this.podBay.newPod({
            podName: 'system',
            processType: ProcessType.ORBITDB
        });
        const authDb = await this.podBay.openDb({
            podId: orbitDbPodId,
            dbName: 'system-auth',
            dbType: OrbitDbTypes.KEYVALUE
        });
        // Create the database instance for session token storage
        const sessionDb = await this.podBay.openDb({
            podId: orbitDbPodId,
            dbName: 'system-sessions',
            dbType: OrbitDbTypes.KEYVALUE
        });
        const eventLog = await this.podBay.openDb({
            podId: orbitDbPodId,
            dbName: 'system-auth-events',
            dbType: OrbitDbTypes.EVENTS
        });
    }
}
export { MoonbaseAuth };
