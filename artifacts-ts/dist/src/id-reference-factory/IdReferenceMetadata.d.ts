import { IMetaData } from "./IdReferenceInterfaces.js";
/**
 * MetaData class
 */
declare class MetaData implements IMetaData {
    readonly created: Date;
    updated: Date;
    readonly createdBy: string;
    updatedBy: string;
    constructor({ mapped, createdBy }?: {
        mapped?: Map<string, any>;
        createdBy?: string;
    });
    toString(): string;
    set(key: string, value: any): {
        key: string;
        value: any;
    };
    get(key: string): any;
    has(key: string): any;
    delete(key: string): void;
    clear(): void;
    update({ key, value, updatedBy }: {
        key: string;
        value: any;
        updatedBy?: string;
    }): {
        key: string;
        value: any;
        updatedBy: string;
        updated: Date;
    };
    keys(): string[];
    values(): any[];
    entries(): [string, any][];
    forEach(callback: (key: string, value: any) => void): void;
    toJSON(): string;
    toMap(): Map<string, any>;
    fromJSON(data: string): void;
    fromMap(data: Map<string, any>): void;
}
export { MetaData };
//# sourceMappingURL=IdReferenceMetadata.d.ts.map