/**
 * MoonbaseAuth.ts
 * 
 * This file contains the MoonbaseAuth class, which is responsible for handling
 * authentication and authorization for the Moonbase system.
 * 
 * @category System
 */
import { PodBay } from '../pod-bay/index.js';
import { LogLevel, PodId, ProcessType, logger } from 'd3-artifacts';
import { OrbitDbTypes } from '../open-db-process/OpenDbOptions.js';
import { Libp2pProcessConfig } from '../libp2p-process/processConfig.js';
import crypto from 'crypto';
import fs from 'fs/promises';
import { Libp2pProcessOptions, createLibp2pProcessOptions } from '../libp2p-process/processOptions.js';
import path from 'path';
import { writeConfig } from './MoonbaseConfig.js';

interface MoonbaseAuthOptions {
    authDbCid?: string;
    sessionDbCid?: string;
    eventLogCid?: string;
    systemSwarmKey?: string;
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
    options: MoonbaseAuthOptions;

    
    constructor({
        podBay,
        swarmKey,
        authDbCid,
        sessionDbCid,
        eventLogCid
    } : {
        podBay: PodBay,
        swarmKey?: string,
        authDbCid?: string,
        sessionDbCid?: string,
        eventLogCid?: string
    }) {
        this.podBay = podBay;
        this.options = {
            authDbCid,
            sessionDbCid,
            eventLogCid,
            systemSwarmKey: swarmKey
        }
    }

    async init(): Promise<void> {
        logger({
            level: LogLevel.INFO,
            message: `Initializing MoonbaseAuth`
        });

        const swarmKeyRaw = this.options.systemSwarmKey ? this.options.systemSwarmKey : crypto.randomBytes(32).toString('hex')

        logger({
            level: LogLevel.INFO,
            message: `Swarm key: ${swarmKeyRaw}`
        })

        try {
            let systemPodId: PodId | undefined = undefined

            const libp2pConfig: Libp2pProcessConfig = new Libp2pProcessConfig({
                enablePrivateSwarm: true,
                privateSwarmKey: swarmKeyRaw
            })
    
            const libp2pOptions: Libp2pProcessOptions = await createLibp2pProcessOptions({
                processConfig: libp2pConfig
            })

            // check if the system pod exists
            let systemPod = this.podBay.getPod('system');
    
            if (!systemPod) {
                systemPodId = await this.podBay.newPod({
                    podName: 'system',
                    processType: ProcessType.ORBITDB,
                    options: { libp2pOptions }
                })
            }
            else {
                systemPodId = systemPod.id;
            }

            systemPod = this.podBay.getPod(systemPodId);
            

            

            const orbitDbProcessId = systemPod?.orbitDb?.id

            // Create the database instance for authentication
            
    
            this.authDb = await this.podBay.openDb({
                orbitDbId: orbitDbProcessId,
                dbName: this.options.authDbCid ? `/orbitdb/${this.options.authDbCid}` : 'system-auth',
                dbType: OrbitDbTypes.DOCUMENTS
            });
    
            // Create the database instance for session token storage
            this.sessionDb = await this.podBay.openDb({
                orbitDbId: orbitDbProcessId,
                dbName: this.options.sessionDbCid ? `/orbitdb/${this.options.sessionDbCid}` : 'system-sessions',
                dbType: OrbitDbTypes.KEYVALUE
            });
    
            this.eventLog = await this.podBay.openDb({
                orbitDbId: orbitDbProcessId,
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

            await writeConfig(new Map<string, any>([[ 'auth' , {
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
    }
}

export {
    MoonbaseAuth,
    MoonbaseAuthOptions
}
