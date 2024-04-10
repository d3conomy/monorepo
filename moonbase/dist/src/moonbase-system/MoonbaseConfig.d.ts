import { LunarPod } from '../lunar-pod/index.js';
/**
 * Configuration class for moonbase
 * @category Moonbase
 */
declare class Config {
    /**
     * Configure logging
     * @default level "info"
     * @default dir "./logs"
     */
    logs: {
        level: string;
        dir: string;
    };
    /**
     * General configuration
     * @default names "uuid"
     * @example
     * { "names": "uuid" | "name" | "string" }
     */
    general: {
        names: string;
    };
    /**
     * API configuration
     * @default port 4343
     * @default corsOrigin "*"
     * @example
     * { "port": 4343, "corsOrigin": "*" }
     */
    api: {
        port: number;
        corsOrigin: string;
    };
    /**
     * Authentication configuration
     */
    auth: {
        authDbCid: string;
        sessionDbCid: string;
        eventLogCid: string;
        systemSwarmKey: string;
    };
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
    pods?: Array<LunarPod>;
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
    constructor(config?: any);
}
/**
 * Load configuration
 * @description Load configuration from config.json file.
 *  The default location for the config.json file is the root of the project.
 * @category Moonbase
 */
declare const loadConfig: () => Promise<Config>;
declare const writeConfig: (update: Map<string, any>) => Promise<void>;
export { Config, loadConfig, writeConfig };
//# sourceMappingURL=MoonbaseConfig.d.ts.map