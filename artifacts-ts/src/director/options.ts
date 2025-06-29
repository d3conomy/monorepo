
import { BaseRecord, RecordManager } from "./records.js";

class OptionRecord<T>
    extends BaseRecord
    implements 
        Record<'required', boolean>,
        Record<'defaultValue', T | undefined>
{
    public readonly required: boolean;
    public readonly defaultValue: T | undefined;

    constructor({
        name,
        description,
        required,
        defaultValue
    }: {
        name: string,
        description?: string,

        required?: boolean,
        defaultValue?: T
    }) {
        super({name, description});
        this.required = required !== undefined ? required : false;
        this.defaultValue = defaultValue;
    }

    public toString(): string {
        return `${this.name}`;
    }

    public toJSON(): any {
        return {
            name: this.name,
            description: this.description,
            required: this.required,
            defaultValue: this.defaultValue
        }
    }
}


class Options extends RecordManager<OptionRecord<any>> {
}

export {
    Options,
    OptionRecord
}