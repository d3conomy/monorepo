import { IMetaData } from "./IdReferenceInterfaces";
/**
 * MetaData class
 */
declare class MetaData implements IMetaData {
    data: Map<string, any>;
    constructor(data?: Map<string, any>);
    set(key: string, value: any): void;
    get(key: string): any;
    delete(key: string): void;
    has(key: string): boolean;
    update(key: string, value: any): void;
    clear(): void;
}
export { MetaData };
//# sourceMappingURL=IdReferenceMetadata.d.ts.map