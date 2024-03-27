import { IMetaData } from "./IdReferenceInterfaces";

/**
 * MetaData class
 */
class MetaData 
    implements IMetaData 
{
    public data: Map<string, any>;

    constructor(data?: Map<string, any>) {
        this.data = data ? data : new Map();
    }

    public set(key: string, value: any): void {
        this.data.set(key, value);
    }

    public get(key: string): any {
        return this.data.get(key);
    }

    public delete(key: string): void {
        this.data.delete(key);
    }

    public has(key: string): boolean {
        return this.data.has(key);
    }

    public update(key: string, value: any): void {
        if (this.has(key)) {
            this.set(key, value);
        }
        else {
            throw new Error(`MetaData: Key ${key} does not exist`);
        }
    }

    public clear(): void {
        this.data.clear();
    }
}

export { 
    MetaData
}