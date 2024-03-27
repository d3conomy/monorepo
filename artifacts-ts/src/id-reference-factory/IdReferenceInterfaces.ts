import { IdReferenceFormats } from "./IdReferenceConstants.js";

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

interface IIdReference {
    name: string;
    metadata: IMetaData;

    toString(): string;
}

interface ISystemId extends IIdReference {
}

interface IMoonbaseId extends IIdReference {
    systemId: ISystemId;
}

interface IPodBayId extends IIdReference {
    moonbaseId: IMoonbaseId;
}

interface IPodId extends IIdReference {
    podBayId: IPodBayId;
}

interface IPodProcessId extends IIdReference {
    podId: IPodId;
}

interface IJobId extends IIdReference {
    componenetId: IPodProcessId | IPodId | IPodBayId | IMoonbaseId | ISystemId;
}
    

interface IIdReferenceFactory {
    ids: Array<IIdReference>;

    isUnique(name: string): boolean;
    createIdReference(name: string, metadata?: IMetaData, format?: IdReferenceFormats): IIdReference;
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