import { LogLevel, ProcessType, logger } from 'd3-artifacts';
import { OrbitDbTypes } from '../open-db-process/OpenDbOptions.js';
import { Libp2pProcessConfig } from '../libp2p-process/processConfig.js';
import crypto from 'crypto';
import { createLibp2pProcessOptions } from '../libp2p-process/processOptions.js';
import { writeConfig } from './MoonbaseConfig.js';
/**
 * The Moonbase authentication class
 * @category System
 */
class MoonbaseAuth {
    podBay;
    authDb;
    sessionDb;
    eventLog;
    options;
    constructor({ podBay, swarmKey, authDbCid, sessionDbCid, eventLogCid }) {
        this.podBay = podBay;
        this.options = {
            authDbCid,
            sessionDbCid,
            eventLogCid,
            systemSwarmKey: swarmKey
        };
    }
    async init() {
        logger({
            level: LogLevel.INFO,
            message: `Initializing MoonbaseAuth`
        });
        const swarmKeyRaw = this.options.systemSwarmKey ? this.options.systemSwarmKey : crypto.randomBytes(32).toString('hex');
        logger({
            level: LogLevel.INFO,
            message: `Swarm key: ${swarmKeyRaw}`
        });
        try {
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
                dbName: this.options.authDbCid ? `/orbitdb/${this.options.authDbCid}` : 'system-auth',
                dbType: OrbitDbTypes.DOCUMENTS
            });
            // Create the database instance for session token storage
            this.sessionDb = await this.podBay.openDb({
                podId: orbitDbPodId,
                dbName: this.options.sessionDbCid ? `/orbitdb/${this.options.sessionDbCid}` : 'system-sessions',
                dbType: OrbitDbTypes.KEYVALUE
            });
            this.eventLog = await this.podBay.openDb({
                podId: orbitDbPodId,
                dbName: this.options.eventLogCid ? `/orbitdb/${this.options.eventLogCid}` : 'system-auth-events',
                dbType: OrbitDbTypes.EVENTS
            });
            if (!this.authDb || !this.sessionDb || !this.eventLog) {
                logger({
                    level: LogLevel.ERROR,
                    message: `Error initializing MoonbaseAuth`
                });
                return;
            }
            await writeConfig(new Map([['auth', {
                        authDbCid: this.authDb.address.toString().split('/')[2],
                        sessionDbCid: this.sessionDb.address.toString().split('/')[2],
                        eventLogCid: this.eventLog.address.toString().split('/')[2],
                        systemSwarmKey: swarmKeyRaw
                    }]]));
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                message: `Error initializing MoonbaseAuth: ${error}`
            });
            return;
        }
        logger({
            level: LogLevel.INFO,
            message: `MoonbaseAuth initialized`
        });
    }
}
export { MoonbaseAuth };
