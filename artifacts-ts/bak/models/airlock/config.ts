import { Database } from '../moonbase/database';


/**
 * Class for Airlock configuration
 * @category Airlock
 * @remarks This is used to define the configuration for the airlock server
 * @summary
 * The configuration for the airlock server
 */
class AirlockConfig {
    moonbaseUrl: string;
    databases: Array<Database>;

    constructor({
        moonbaseUrl,
        databases
    }: {
        moonbaseUrl: string,
        databases?: Array<Database>
    }) {
        this.moonbaseUrl = moonbaseUrl;
        this.databases = databases ? databases : new Array<Database>();
    }
}

export {
    AirlockConfig
}