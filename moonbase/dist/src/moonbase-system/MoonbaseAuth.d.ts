/**
 * MoonbaseAuth.ts
 *
 * This file contains the MoonbaseAuth class, which is responsible for handling
 * authentication and authorization for the Moonbase system.
 *
 * @category System
 */
import { PodBay } from '../pod-bay/index.js';
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
declare class MoonbaseAuth {
    podBay: PodBay;
    authDb: any;
    sessionDb: any;
    eventLog: any;
    options: MoonbaseAuthOptions;
    constructor({ podBay, swarmKey, authDbCid, sessionDbCid, eventLogCid }: {
        podBay: PodBay;
        swarmKey?: string;
        authDbCid?: string;
        sessionDbCid?: string;
        eventLogCid?: string;
    });
    init(): Promise<void>;
}
export { MoonbaseAuth, MoonbaseAuthOptions };
//# sourceMappingURL=MoonbaseAuth.d.ts.map