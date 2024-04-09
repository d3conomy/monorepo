/**
 * MoonbaseAuth.ts
 * 
 * This file contains the MoonbaseAuth class, which is responsible for handling
 * authentication and authorization for the Moonbase system.
 * 
 * @category System
 */
import { PodBay } from '../pod-bay/index.js';
import { LogLevel, ProcessType, logger } from 'd3-artifacts';
import { OrbitDbTypes } from '../open-db-process/OpenDbOptions.js';

interface MoonbaseAuthOptions {
    authDbCid?: string;
    sessionDbCid?: string;
    eventLogCid?: string;
}

/**
 * The Moonbase authentication class
 * @category System
 */
class MoonbaseAuth {
    podBay: PodBay;
    authDb: any;
    sessionDb: any;
    eventLog: any;

    
    constructor({
        podBay
    } : {
        podBay: PodBay
    }) {
        this.podBay = podBay;
    }

    async init(): Promise<void> {
        logger({
            level: LogLevel.INFO,
            message: `Initializing MoonbaseAuth`
        });

        // Create the database instance for authentication
        const orbitDbPodId = await this.podBay.newPod({
            podName: 'system',
            processType: ProcessType.ORBITDB
        })

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

export {
    MoonbaseAuth,
    MoonbaseAuthOptions
}
