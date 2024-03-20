import { Database, DatabaseReference } from '../moonbase/database';
import { Defaults } from '../../defaults';

class AirlockConfig {
    moonbaseUrl: string;
    databases: Map<DatabaseReference['id'], Database> = new Map<DatabaseReference['id'], Database>();

    constructor({
        moonbaseUrl,
        databases
    }: {
        moonbaseUrl: string,
        databases?: Array<DatabaseReference>
    }) {
        this.moonbaseUrl = moonbaseUrl ? moonbaseUrl : Defaults.moonbaseUrl;
        this.databases = databases ? new Map(databases.map((database) => [database.id, new Database(database)])) : new Map();
        console.log('AirlockConfig');
    }
}

export {
    AirlockConfig
}