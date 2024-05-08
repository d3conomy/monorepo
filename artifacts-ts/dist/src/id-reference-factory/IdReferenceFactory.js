import { logger } from "../log-books-manager/LogBooksManager.js";
import { LogLevel } from "../log-books-manager/LogLevels.js";
import { ContainerId, IdReference, JobId, MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from "./IdReferenceClasses.js";
import { IdReferenceConfig } from "./IdReferenceConfig.js";
import { IdReferenceTypes } from "./IdReferenceConstants.js";
import { createRandomId } from "./IdReferenceFunctions.js";
import { MetaData } from "./IdReferenceMetadata.js";
class IdReferenceFactory {
    ids = new Array();
    config;
    constructor({ idReferenceFormat } = {}) {
        this.config = new IdReferenceConfig({ idReferenceFormat });
    }
    isUnique(name) {
        return !this.ids.some((idRef) => idRef.name === name);
    }
    createIdReference({ name, metadata, format, type, dependsOn }) {
        if (!type) {
            throw new Error("IdReferenceFactory: type is required");
        }
        if (name && !this.isUnique(name)) {
            logger({
                level: LogLevel.WARN,
                message: `IdReferenceFactory: name ${name} already exists, creaating new name`
            });
            name = `${name}-${createRandomId('string')}`;
        }
        if (!format && !name) {
            format = this.config.idReferenceFormat;
        }
        let dependsOnId;
        if (dependsOn && typeof dependsOn === "string") {
            dependsOnId = this.getIdReference(dependsOn);
        }
        else if (dependsOn instanceof PodBayId || dependsOn instanceof PodId || dependsOn instanceof SystemId || dependsOn instanceof MoonbaseId) {
            dependsOnId = dependsOn;
        }
        else if (type === IdReferenceTypes.SYSTEM) {
            dependsOnId = undefined;
        }
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
        let idref;
        switch (type) {
            case IdReferenceTypes.SYSTEM:
                idref = new SystemId({ name, metadata, format });
                break;
            case IdReferenceTypes.MOONBASE:
                idref = new MoonbaseId({ name, metadata, format, systemId: dependsOnId });
                break;
            case IdReferenceTypes.POD_BAY:
                idref = new PodBayId({ name, metadata, format, moonbaseId: dependsOnId });
                break;
            case IdReferenceTypes.POD:
                idref = new PodId({ name, metadata, format, podBayId: dependsOnId });
                break;
            case IdReferenceTypes.CONTAINER:
                idref = new ContainerId({ name, metadata, format, podId: dependsOnId });
                break;
            case IdReferenceTypes.PROCESS:
                idref = new PodProcessId({ name, metadata, format, podId: dependsOnId });
                break;
            case IdReferenceTypes.JOB:
                idref = new JobId({ name, metadata, format, componentId: dependsOnId });
            default:
                idref = new IdReference({ name, metadata, format });
        }
        this.ids.push(idref);
        return idref;
    }
    getIdReference(name) {
        return this.ids.find((idRef) => idRef.name === name);
    }
    getAllIdReferences() {
        return this.ids;
    }
    getIdReferencesByType(type) {
        return this.ids.filter((idRef) => idRef.metadata.get("type") === type);
    }
    deleteIdReference(name) {
        this.ids = this.ids.filter((idRef) => idRef.name !== name);
    }
    deleteAllIdReferences() {
        this.ids = new Array();
    }
}
export { IdReferenceFactory };
