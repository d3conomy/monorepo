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
            let systemPodId = undefined;
            const libp2pConfig = new Libp2pProcessConfig({
                enablePrivateSwarm: true,
                privateSwarmKey: swarmKeyRaw,
                enableWebRTCStar: true,
                webRTCStarAddress: '/dns4/signal.trnk.xyz/tcp/443/wss/p2p-webrtc-star',
                enableBootstrap: true,
                bootstrapMultiaddrs: [
                    "/dns4/libp2p.ipfs.trnkt.xyz/tcp/4007/p2p/QmZb3uE5oVjZxM5Hs8LutgAXubt8Pf4v1CT41Z63dm4zx7",
                    "/dns4/libp2p-ws.ipfs.trnkt.xyz/tcp/4009/ws/p2p/QmZb3uE5oVjZxM5Hs8LutgAXubt8Pf4v1CT41Z63dm4zx7",
                    "/dnsaddr/bootstrap-ws.ipfs.trnkt.xyz/tcp/4003/ws/p2p/12D3KooWHSiT24kaXquLa4HB2h9eGtnXRAryWMZjinbe7yt5ihUd",
                    "/dnsaddr/bootstrap-ws.ipfs.trnkt.xyz/tcp/4003/ws/p2p/12D3KooWDRmmGtJksoRrbuETHUAWRTDvkZiykEQtUdBHj3Vg2Ha6",
                    "/dnsaddr/bootstrap-ws.ipfs.trnkt.xyz/tcp/4003/ws/p2p/12D3KooWLMWGmGf6LEsVvtJTAoSogfbiHqQzsPfJvAC3kE7ikkP6",
                    "/dnsaddr/bootstrap-ws.ipfs.trnkt.xyz/tcp/4003/ws/p2p/12D3KooWNFkQH6PeC2zsuSrDd3S9FDMNaqePumUEoSvxceJJYtjf"
                ]
            });
            const libp2pOptions = await createLibp2pProcessOptions({
                processConfig: libp2pConfig
            });
            // check if the system pod exists
            let systemPod = this.podBay.getPod('system');
            if (!systemPod) {
                systemPodId = await this.podBay.newPod({
                    podName: 'system',
                    processType: ProcessType.ORBITDB,
                    options: { libp2pOptions }
                });
                systemPod = this.podBay.getPod(systemPodId);
            }
            else {
                systemPodId = systemPod.id;
            }
            const orbitDbProcessId = systemPod?.orbitDb?.id;
            // Create the database instance for authentication
            this.authDb = await this.podBay.openDb({
                podId: systemPodId,
                // orbitDbId: orbitDbProcessId,
                dbName: this.options.authDbCid ? `/orbitdb/${this.options.authDbCid}` : 'system-auth',
                dbType: OrbitDbTypes.DOCUMENTS
            });
            // Create the database instance for session token storage
            this.sessionDb = await this.podBay.openDb({
                podId: systemPodId,
                // orbitDbId: orbitDbProcessId,
                dbName: this.options.sessionDbCid ? `/orbitdb/${this.options.sessionDbCid}` : 'system-sessions',
                dbType: OrbitDbTypes.KEYVALUE
            });
            this.eventLog = await this.podBay.openDb({
                podId: systemPodId,
                // orbitDbId: orbitDbProcessId,
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
    }
}
export { MoonbaseAuth };
