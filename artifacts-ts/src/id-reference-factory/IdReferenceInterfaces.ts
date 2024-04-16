import { IdReferenceFormats, IdReferenceTypes } from "./IdReferenceConstants.js";

interface IMetaData {
    [key: string]: any;

    set(key: string, value: any): { key: string, value: any };
    get(key: string): any;
    has(key: string): boolean;
    delete(key: string): void;
    clear(): void;
    update({ key , value, updatedBy }: { key: string, value: any, updatedBy: string }): { key: string, value: any, updatedBy: string, updated: Date };
    keys(): Array<string>;
    values(): Array<any>;
    entries(): Array<[string, any]>;
    forEach(callback: (key: string, value: any) => void): void;
    toJSON(): string;
    toString(): string;
    toMap(): Map<string, any>;
    fromMap(data: Map<string, any>): void;
    fromJSON(data: string): void;
}

interface IIdReference<T = IdReferenceTypes> {
    name: string;
    type: T;
    metadata: IMetaData;

    toString(): string;
}

interface ISystemId extends IIdReference<IdReferenceTypes.SYSTEM> {
}

interface IMoonbaseId extends IIdReference<IdReferenceTypes.MOONBASE> {
    systemId: ISystemId;
}

interface IPodBayId extends IIdReference<IdReferenceTypes.POD_BAY> {
    moonbaseId: IMoonbaseId;
}

interface IPodId extends IIdReference<IdReferenceTypes.POD> {
    podBayId: IPodBayId;
}

interface IPodProcessId extends IIdReference<IdReferenceTypes.PROCESS> {
    podId: IPodId;
}

interface IJobId extends IIdReference<IdReferenceTypes.JOB> {
    componentId: IPodProcessId | IPodId | IPodBayId | IMoonbaseId | ISystemId;
}
    

interface IIdReferenceFactory {
    ids: Array<IIdReference>;

    // isUnique(name: string): boolean;
    createIdReference({
        name,
        metadata,
        format,
        type,
        dependent
    }: {
        name?: string,
        metadata?: IMetaData | Map<string, any>,
        format?: IdReferenceFormats | string,
        type: string,
        dependent?: IIdReference | string
    }): IIdReference;
    getIdReference(name: string): IIdReference | undefined;
    deleteIdReference(name: string): void;
    deleteAllIdReferences(): void;
}


export {
    IMetaData,
    IIdReference,
    ISystemId,
    IMoonbaseId,
    IPodBayId,
    IPodId,
    IPodProcessId,
    IJobId,
    IIdReferenceFactory
}