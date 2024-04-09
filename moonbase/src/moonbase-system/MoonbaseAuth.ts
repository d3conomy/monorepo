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
import { Libp2pProcessConfig } from '../libp2p-process/processConfig.js';
import { createSwarmKey } from '../libp2p-process/connectionProtector.js';
import crypto from 'crypto';
import { Libp2pProcessOptions, createLibp2pProcessOptions } from '../libp2p-process/processOptions.js';

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

        const swarmKeyRaw = crypto.randomBytes(32).toString('hex')

        logger({
            level: LogLevel.INFO,
            message: `Swarm key: ${swarmKeyRaw}`
        })

        const libp2pConfig: Libp2pProcessConfig = new Libp2pProcessConfig({
            enablePrivateSwarm: true,
            privateSwarmKey: swarmKeyRaw
        })

        const libp2pOptions: Libp2pProcessOptions = await createLibp2pProcessOptions({
            processConfig: libp2pConfig
        })

        // Create the database instance for authentication
        const orbitDbPodId = await this.podBay.newPod({
            podName: 'system',
            processType: ProcessType.ORBITDB,
            options: { libp2pOptions }
        })

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

export {
    MoonbaseAuth,
    MoonbaseAuthOptions
}
