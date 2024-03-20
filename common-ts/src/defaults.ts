import { IdReferenceFormat, LogLevel, PodProcessType } from "./models";
import { OrbitDbTypes } from "./models/moonbase/database";

class Defaults {
    // General
    public static readonly logLevel = LogLevel.Info;
    public static readonly idReferenceFormat = IdReferenceFormat.Name;

    // Airlock

    
    // Moonbase
    public static readonly moonbaseApiUrl = 'http://0.0.0.0';
    public static readonly moonbaseApiPort = 4343;
    public static readonly moonbaseApiCorsOrigin = '*';
    public static readonly moonbaseLogsLevel = LogLevel.Info;
    public static readonly moonbaseLogsDir = './logs';
    public static readonly moonbaseReferenceFormat = IdReferenceFormat.Name;
    public static readonly moonbasePodProcessType = PodProcessType.ORBITDB;
    public static readonly moonbaseDbType = OrbitDbTypes.Documents;

    // Lunar Pod

    // Pod Bay
}


export { Defaults };