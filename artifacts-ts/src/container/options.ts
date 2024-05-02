import { InstanceError, InstanceOptionsError } from "./instance.js";


interface InstanceOption<T> {
    name: string;
    description?: string;
    value?: T;
    required?: boolean;
    defaultValue?: T;
}

class InstanceOptionsList extends Array<InstanceOption<any>> {
    constructor(options: Array<InstanceOption<any>>) {
        super(...options);
    }

    toParams(): { [key: string]: any } {
        let params: { [key: string]: any } = {};
        for (const option of this) {
            if (params.hasOwnProperty(option.name) &&
                option.value !== undefined && 
                option.value !== params[option.name]
            ) {
                throw new InstanceOptionsError(option.name, `Option with name already exists`);
            }

            if (option.value !== undefined) {
                params[option.name] = option.value;
            } else {
                params[option.name] = option.defaultValue;
            }
        }
        return params;
    }
}


const createOptionsList = (options: Array<InstanceOption<any>>): InstanceOptionsList => {
    return new InstanceOptionsList(options);
}


class InstanceOptions {
    public options: InstanceOptionsList;

    constructor({
        options,
        injectDefaults = false,
        defaults
    } : {
        options?: InstanceOptionsList | InstanceOptions | Array<InstanceOption<any>>,
        injectDefaults?: boolean,
        defaults?: InstanceOptions
    } = {}) {
        if (options instanceof Array) {
            this.options = createOptionsList(options);
        } else if (options instanceof InstanceOptionsList) {
            this.options = options;
        } else {
            this.options = new InstanceOptionsList([]);
        }

        if (injectDefaults && defaults) {
            this.injectDefaults(defaults);
        }
    }

    public set(name: string, value: any): InstanceOption<any> {
        const option = this.find(name);
        if (option) {
            option.value = value;
            return option;
        } else {
            throw new InstanceOptionsError(name, `Option with name not found`);
        }
    }

    public get(name: string): any {
        const option = this.find(name);
        if (option) {
            return option.value;
        } else {
            throw new InstanceOptionsError(name, `Option with name not found`);
        }
    }

    public find(name: string): InstanceOption<any> | undefined {
        return this.options.find(option => option.name === name);
    }

    public push(option: InstanceOption<any>): void {
        if (this.find(option.name)) {
            throw new InstanceOptionsError(option.name, `Option with name ${option.name} already exists`);
        }
        this.options.push(option);
    }

    public injectDefaults(defaults: InstanceOptions): void {
        
        for (const defaultOption of defaults.toArray()) {
            const option = this.find(defaultOption.name);

            if (option) {
                if (option.value === undefined) {
                    option.value = defaultOption.value ? defaultOption.value : defaultOption.defaultValue;
                }
                if (option.defaultValue === undefined) {
                    option.defaultValue = defaultOption.defaultValue;
                }
            } else {
                this.push(defaultOption);
            }
        }
    }

    public toArray(): Array<InstanceOption<any>> {
        return this.options;
    }

    public toParams(): { [key: string]: any } {
        return this.options.toParams();
    }
}

export {
    createOptionsList,
    InstanceOption,
    InstanceOptions,
    InstanceOptionsList
}