import { logger } from "../log-books-manager/LogBooksManager.js";
import { LogLevel } from "../log-books-manager/LogLevels.js";
import { ContainerId, IdReference, JobId, MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from "./IdReferenceClasses.js";
import { IdReferenceConfig } from "./IdReferenceConfig.js";
import { IdReferenceFormats, IdReferenceTypes } from "./IdReferenceConstants.js";
import { createRandomId } from "./IdReferenceFunctions.js";
import { MetaData } from "./IdReferenceMetadata.js";


type IdTypes = PodBayId | PodId | SystemId | MoonbaseId | JobId | PodProcessId | IdReference | ContainerId;

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
        dependsOn?: IdTypes | string
    }): IdTypes | any {
        if (!type) {
            throw new Error("IdReferenceFactory: type is required");
        }
        if (name && !this.isUnique(name)) {
            logger({
                level: LogLevel.WARN,
                message: `IdReferenceFactory: name ${name} already exists, creaating new name`
            });
            name = `${name}-${createRandomId('string')}`
        }
        if (!format && !name) {
            format = this.config.idReferenceFormat;
        }

        let dependsOnId;
        if (dependsOn && typeof dependsOn === "string") {
            dependsOnId = this.getIdReference(dependsOn);
        }
        else if (dependsOn instanceof ContainerId || dependsOn instanceof PodBayId || dependsOn instanceof PodId || dependsOn instanceof SystemId || dependsOn instanceof MoonbaseId){
            dependsOnId = dependsOn;
        }
        else if (type === IdReferenceTypes.SYSTEM) {
            dependsOnId = undefined;
        }

        console.log(`dependsOnId: ${dependsOnId}`)

        if (metadata instanceof Map) {
            metadata = new MetaData({
                mapped: metadata,
                createdBy: dependsOnId?.name || "system"
            });
        }
        else {
            metadata = metadata ? metadata : new MetaData();
        }
        metadata.set("created", new Date());
        metadata.set("type", type);


        let idref: IdReference;
        switch (type) {
            case IdReferenceTypes.SYSTEM:
                idref = new SystemId({name, metadata, format});
                break;
            case IdReferenceTypes.MOONBASE:
                idref = new MoonbaseId({name, metadata, format, systemId: dependsOnId as SystemId});
                break;
            case IdReferenceTypes.POD_BAY:
                idref = new PodBayId({name, metadata, format, moonbaseId: dependsOnId as MoonbaseId});
                break;
            case IdReferenceTypes.POD:
                idref = new PodId({name, metadata, format, podBayId: dependsOnId as PodBayId});
                break;
            case IdReferenceTypes.CONTAINER:
                idref = new ContainerId({name, metadata, format, podId: dependsOnId as PodId});
                break;
            case IdReferenceTypes.PROCESS:
                idref = new PodProcessId({name, metadata, format, podId: dependsOnId as PodId});
                break;
            case IdReferenceTypes.JOB:
                idref = new JobId({name, metadata, format, componentId: dependsOnId as ContainerId | PodId | PodBayId | MoonbaseId | SystemId});
                break;
            default:
                idref = new IdReference({name, metadata, format});
        }
        this.ids.push(idref);
        // console.log(`idref: ${idref}`)
        return idref;
    }

    public getIdReference(name: string): IdTypes | undefined {
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
    IdReferenceFactory,
    IdTypes
}