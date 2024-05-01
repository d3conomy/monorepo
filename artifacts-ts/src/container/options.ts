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
            if (params.hasOwnProperty(option.name)) {
                if (option.value !== undefined && option.value !== params[option.name]) {
                    throw new InstanceOptionsError(option.name, `Option with name already exists`);
                }
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

    constructor(options: Array<InstanceOption<any>> | InstanceOptionsList, injectDefaults: boolean = false, defaults?: InstanceOptionsList) {
        this.options = createOptionsList(options);
        if (injectDefaults && defaults) {
            this.injectDefaults(defaults);
        }
    }

    find(name: string): InstanceOption<any> | undefined {
        return this.options.find(option => option.name === name);
    }

    push(option: InstanceOption<any>): void {
        if (this.find(option.name)) {
            throw new Error(`Option with name ${option.name} already exists`);
        }
        this.options.push(option);
    }

    injectDefaults(defaults: InstanceOptionsList): void {
        for (const defaultOption of defaults) {
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

    toParams(): { [key: string]: any } {
        return this.options.toParams();
    }
}

export {
    InstanceOption,
    InstanceOptions,
    InstanceOptionsList
}