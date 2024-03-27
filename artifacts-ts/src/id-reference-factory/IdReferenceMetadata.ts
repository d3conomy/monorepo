import { IMetaData } from "./IdReferenceInterfaces.js";

/**
 * MetaData class
 */
class MetaData
    implements IMetaData
{
    public readonly created: Date;
    public updated: Date;
    public readonly createdBy: string;
    public updatedBy: string;

    constructor({
        mapped,
        createdBy
    }: {
        mapped?: Map<string, any>,
        createdBy?: string,
    } = {}) {
        this.created = new Date();
        this.updated = new Date();
        this.createdBy = createdBy ? createdBy : 'system';
        this.updatedBy = createdBy ? createdBy : 'system';

        if (mapped) {
            for (const [key, value] of mapped) {
                (this as any)[key] = value;
            }
        }
    }

    public toString(): string {
        return `Created: ${this.created} by ${this.createdBy}, Updated: ${this.updated} by ${this.updatedBy}`;
    }

    public set(
        key: string,
        value: any
    ) {
        (this as any)[key] = value;

        return {
            key,
            value
        };
    }

    public get(key: string) {
        return (this as any)[key];
    }

    public has(key: string) {
        return (this as any).hasOwnProperty(key);
    }

    public delete(key: string) {
        delete (this as any)[key];
    }

    public clear() {
        Object.keys(this).forEach(key => {
            delete (this as any)[key];
        });
    }

    public update({
        key,
        value,
        updatedBy
    }: {
        key: string,
        value: any,
        updatedBy?: string
    }) {
        (this as any)[key] = value;

        this.updated = new Date();
        this.updatedBy = updatedBy ? updatedBy : 'system';

        return {
            key,
            value,
            updatedBy: this.updatedBy,
            updated: this.updated
        };
    }

    public keys() {
        return Object.keys(this);
    }

    public values() {
        return Object.values(this);
    }

    public entries() {
        return Object.entries(this);
    }

    public forEach(callback: (key: string, value: any) => void) {
        Object.entries(this).forEach(([key, value]) => {
            callback(key, value);
        });
    }

    public toJSON() {
        return JSON.stringify(this);
    }

    public toMap() {
        return new Map(Object.entries(this));
    }

    public fromJSON(data: string): void {
        const parsed = JSON.parse(data);
        Object.keys(parsed).forEach(key => {
            (this as any)[key] = parsed[key];
        });
    }

    public fromMap(data: Map<string, any>): void {
        data.forEach((value, key) => {
            (this as any)[key] = value;
        });
    }
}

export { 
    MetaData
}