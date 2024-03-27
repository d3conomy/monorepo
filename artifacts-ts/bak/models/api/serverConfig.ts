import { Defaults } from "../../constants/Defaults";

class ServerConfig {
    public readonly host: string;
    public readonly port: number;
    public readonly path: string;
    public readonly version: string;
    public readonly base_url: string;

    constructor({
        host,
        port,
        path,
        version
    } : {
        host?: string,
        port?: number,
        path?: string,
        version?: string
    } = {}) {
        this.host = host ? host : Defaults.moonbaseApiHost;
        this.port = port ? port : Defaults.moonbaseApiPort;
        this.path = path ? path : Defaults.moonbaseApiPath;
        this.version = version ? version : Defaults.moonbaseApiVersion;
        this.base_url = `${this.host}:${this.port}/${this.path}/${this.version}`;
    }
}

export default ServerConfig;