import { Defaults } from '../../defaults';
import { LogLevel } from '../log';

class MoonbaseConfig {
    logLevel: LogLevel = Defaults.logLevel;
    moonBaseUrl: string = Defaults.moonbaseApiUrl;


    constructor(
        moonbaseApiUrl: string
    ) {
        this.moonBaseUrl = moonbaseApiUrl;
    }
}

export {
    MoonbaseConfig
}