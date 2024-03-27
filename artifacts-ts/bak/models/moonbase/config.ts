import { Defaults } from '../../constants/Defaults';
import { LogLevel } from '../log';

class MoonbaseConfig {
    logLevel: LogLevel = Defaults.logLevel;
    moonBaseUrl: string = Defaults.moonbaseApiUrl;


    constructor({
        moonbaseApiUrl,
        logLevel
    } : {
        moonbaseApiUrl: string,
        logLevel?: LogLevel
    }) {
        this.moonBaseUrl = moonbaseApiUrl;
        this.logLevel = logLevel || Defaults.logLevel;
    
    }
}

export {
    MoonbaseConfig
}