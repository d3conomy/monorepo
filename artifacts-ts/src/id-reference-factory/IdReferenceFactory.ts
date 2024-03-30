import { IdReference, JobId, MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from "./IdReferenceClasses.js";
import { IdReferenceConfig } from "./IdReferenceConfig.js";
import { IdReferenceFormats, IdReferenceTypes } from "./IdReferenceConstants.js";
import { MetaData } from "./IdReferenceMetadata.js";


type IdTypes = PodBayId | PodId | SystemId | MoonbaseId | JobId | PodProcessId | IdReference;

class IdReferenceFactory {
    public ids: Array<IdReference> = new Array<IdReference>();
    public config: IdReferenceConfig;

    constructor({
        idReferenceFormat
    } : {
        idReferenceFormat?: IdReferenceFormats
    } = {}) {
        this.config = new IdReferenceConfig({idReferenceFormat});
    }

    private isUnique(name: string): boolean {
        return !this.ids.some((idRef) => idRef.name === name);
    }

    public createIdReference({
        name,
        metadata,
        format,
        type,
        dependsOn
    }: {
        name?: string,
        metadata?: MetaData | Map<string, any>,
        format?: IdReferenceFormats | string,
        type: IdReferenceTypes | string,
        dependsOn?: PodBayId | PodId | SystemId | MoonbaseId | string
    }): IdTypes | any {
        if (!type) {
            throw new Error("IdReferenceFactory: type is required");
        }
        if (name && !this.isUnique(name)) {
            throw new Error(`IdReferenceFactory: IdReference with name ${name} already exists`);
        }
        if (!format && !name) {
            format = this.config.idReferenceFormat;
        }

        if (metadata instanceof Map) {
            metadata = new MetaData({
                mapped: metadata,
                createdBy: "system"
            });
        }
        else {
            metadata = metadata ? metadata : new MetaData();
        }
        metadata.set("dateCreated", new Date());
        metadata.set("type", type);


        let idref: IdReference;
        switch (type) {
            case IdReferenceTypes.SYSTEM:
                idref = new SystemId({name, metadata, format});
                break;
            case IdReferenceTypes.MOONBASE:
                idref = new MoonbaseId({name, metadata, format, systemId: dependsOn as SystemId});
                break;
            case IdReferenceTypes.PODBAY:
                idref = new PodBayId({name, metadata, format, moonbaseId: dependsOn as MoonbaseId});
                break;
            case IdReferenceTypes.POD:
                idref = new PodId({name, metadata, format, podBayId: dependsOn as PodBayId});
                break;
            case IdReferenceTypes.PROCESS:
                idref = new PodProcessId({name, metadata, format, podId: dependsOn as PodId});
                break;
            case IdReferenceTypes.JOB:
                idref = new JobId({name, metadata, format, componenetId: dependsOn as PodProcessId | PodId | PodBayId | MoonbaseId | SystemId});
            default:
                idref = new IdReference({name, metadata, format});
        }
        this.ids.push(idref);
        return idref;
    }

    public getIdReference(name: string): IdReference | undefined {
        return this.ids.find((idRef) => idRef.name === name);
    }

    public getAllIdReferences(): Array<IdReference> {
        return this.ids;
    }

    public getIdReferencesByType(type: IdReferenceTypes | string): Array<IdReference> {
        return this.ids.filter((idRef) => idRef.metadata.get("type") === type);
    }

    public deleteIdReference(name: string): void {
        this.ids = this.ids.filter((idRef) => idRef.name !== name);
    }

    public deleteAllIdReferences(): void {
        this.ids = new Array<IdReference>();
    }
}

export {
    IdReferenceFactory
}