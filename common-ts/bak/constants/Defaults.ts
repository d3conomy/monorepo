import { IdReferenceFormats } from './IdReferenceFormats';
import { OrbitDbTypes } from "../models/moonbase/database";
import { LogLevel } from "./LogLevel";
import { PodProcessType } from './MoonbaseComponents';

/**
 * Class for default settings
 * @category Config
 */
class Defaults {
    // General
    public static readonly logLevel = LogLevel.Info;
    public static readonly idReferenceFormat = IdReferenceFormats.Name;

    // Airlock

    
    // Moonbase
    public static readonly moonbaseApiHost = 'http://0.0.0.0';
    public static readonly moonbaseApiPort = 4343;
    public static readonly moonbaseApiPath = 'api';
    public static readonly moonbaseApiVersion = 'v0';
    public static readonly moonbaseApiCorsOrigin = '*';
    public static readonly moonbaseLogsLevel = LogLevel.Info;
    public static readonly moonbaseLogsDir = './logs';
    public static readonly moonbaseReferenceFormat = IdReferenceFormats.Name;
    public static readonly moonbasePodProcessType = PodProcessType.ORBITDB;
    public static readonly moonbaseDbType = OrbitDbTypes.Documents;
}


export { Defaults };