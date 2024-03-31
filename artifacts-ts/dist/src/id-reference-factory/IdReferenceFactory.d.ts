import { IdReference, JobId, MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from "./IdReferenceClasses.js";
import { IdReferenceConfig } from "./IdReferenceConfig.js";
import { IdReferenceFormats, IdReferenceTypes } from "./IdReferenceConstants.js";
import { MetaData } from "./IdReferenceMetadata.js";
type IdTypes = PodBayId | PodId | SystemId | MoonbaseId | JobId | PodProcessId | IdReference;
declare class IdReferenceFactory {
    ids: Array<IdReference>;
    config: IdReferenceConfig;
    constructor({ idReferenceFormat }?: {
        idReferenceFormat?: IdReferenceFormats;
    });
    private isUnique;
    createIdReference({ name, metadata, format, type, dependsOn }: {
        name?: string;
        metadata?: MetaData | Map<string, any>;
        format?: IdReferenceFormats | string;
        type: IdReferenceTypes | string;
        dependsOn?: PodBayId | PodId | SystemId | MoonbaseId | string;
    }): IdTypes | any;
    getIdReference(name: string): IdTypes | undefined;
    getAllIdReferences(): Array<IdReference>;
    getIdReferencesByType(type: IdReferenceTypes | string): Array<IdReference>;
    deleteIdReference(name: string): void;
    deleteAllIdReferences(): void;
}
export { IdReferenceFactory, IdTypes };
//# sourceMappingURL=IdReferenceFactory.d.ts.map