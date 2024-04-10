import fs from 'fs/promises';
import path from 'path';


import { IdReferenceFormats, LogLevel, logger } from 'd3-artifacts';
import { LunarPod } from '../lunar-pod/index.js';


/**
 * Configuration class for moonbase
 * @category Moonbase
 */
class Config {
    /**
     * Configure logging
     * @default level "info"
     * @default dir "./logs"
     */
    public logs: {
        level: string,
        dir: string,
    }

    /**
     * General configuration
     * @default names "uuid"
     * @example
     * { "names": "uuid" | "name" | "string" }
     */
    public general: {
        names: string
    }

    /**
     * API configuration
     * @default port 4343
     * @default corsOrigin "*"
     * @example
     * { "port": 4343, "corsOrigin": "*" }
     */
    public api: {
        port: number
        corsOrigin: string
    }

    /**
     * Authentication configuration
     */
    public auth: {
        authDbCid: string,
        sessionDbCid: string,
        eventLogCid: string,
        systemSwarmKey: string
    }

    /**
     * Lunar Pods to include in the system
     * @description Array of LunarPods to include in the system
     * @default Array<LunarPod>
     * @example
     * const myPods = new Array<LunarPod>([
        SystemPod,
        AuthPod,
        UserInfoPod
    ])
     * pods = myPods
     */
    public pods?: Array<LunarPod> = undefined

    /**
     * Creates a new instance of the Config class
     * @description Can take a configuration object as an argument.
     *  This will override the default configuration.
     *  Environment variables will override the configuration object and the default configuration.
     * @example
     * const config = new Config({
        "logs": { "level": "info", "dir": "./logs" },
        "general": { "names": "uuid" },
        "api": { "port": 4343, "corsOrigin": "*" } 
    })
     */
    constructor(config?: any) {
        this.logs = {
            level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : config?.logs?.level || LogLevel.INFO,
            dir: process.env.LOG_DIR ? process.env.LOG_DIR : config?.logs?.dir || "./logs",
        }
        this.general = {
            names: process.env.NAMES ? process.env.NAMES : config?.general?.names || IdReferenceFormats.STRING
        }
        this.api = {
            port: process.env.PORT ? process.env.PORT : config?.server?.port  || 4343,
            corsOrigin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN : config?.api?.corsOrigin || '*'
        }
        this.auth = {
            authDbCid: process.env.AUTH_DB_CID ? process.env.AUTH_DB_CID : config?.auth?.authDbCid || undefined,
            sessionDbCid: process.env.SESSION_DB_CID ? process.env.SESSION_DB_CID : config?.auth?.sessionDbCid || undefined,
            eventLogCid: process.env.EVENT_LOG_CID ? process.env.EVENT_LOG_CID : config?.auth?.eventLogCid || undefined,
            systemSwarmKey: process.env.SYSTEM_SWARM_KEY ? process.env.SYSTEM_SWARM_KEY : config?.auth?.systemSwarmKey || undefined
        }
        this.pods = config?.pods;
    }
}

/**
 * Load configuration
 * @description Load configuration from config.json file.
 *  The default location for the config.json file is the root of the project.
 * @category Moonbase
 */
const loadConfig = async (): Promise<Config> => {
    const __dirname = path.resolve();
    const configPath = path.join(__dirname, './config.json');

    let config;

    try {
        const data = await fs.readFile(configPath, 'utf8');

        config = new Config(JSON.parse(data));

        logger({
            level: LogLevel.DEBUG,
            message: `Config data: ${config.general.names} ${config.logs.level} ${config.logs.dir} ${config.api.port}`
        });
    } catch (err: any) {
        const mesg = `Using default configuation - Error reading file from disk: ${err}`;
        logger({
            level: LogLevel.WARN,
            message: mesg,
            error: err
        });
        config = new Config();
    }
    return config;
}

const writeConfig = async (update: Map<string, any>): Promise<void> => {
    const __dirname = path.resolve();
    const configPath = path.join(__dirname, './config.json');
    const config = await fs.readFile(configPath, 'utf8');
    const configJson = JSON.parse(config);
    
    for (const [key, value] of update) {
        configJson[key] = value;
    }

    await fs.writeFile(configPath, JSON.stringify(configJson, null, 2));

}

export {
    Config,
    loadConfig,
    writeConfig
}