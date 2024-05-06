import { InstanceOptionsError } from "./instance.js";
class InstanceOptionsList extends Array {
    constructor(options) {
        super(...options);
    }
    toParams() {
        let params = {};
        for (const option of this) {
            if (params.hasOwnProperty(option.name) &&
                option.value !== undefined &&
                option.value !== params[option.name]) {
                throw new InstanceOptionsError(option.name, `Option with name already exists`);
            }
            if (option.value !== undefined) {
                params[option.name] = option.value;
            }
            else {
                params[option.name] = option.defaultValue;
            }
        }
        return params;
    }
}
const createOptionsList = (options) => {
    return new InstanceOptionsList(options);
};
class InstanceOptions {
    options;
    constructor({ options, injectDefaults = false, defaults } = {}) {
        if (options instanceof Array) {
            this.options = createOptionsList(options);
        }
        else if (options instanceof InstanceOptionsList) {
            this.options = options;
        }
        else if (options instanceof InstanceOptions) {
            this.options = options.options;
        }
        else {
            this.options = new InstanceOptionsList([]);
        }
        if (injectDefaults && defaults) {
            this.injectDefaults(defaults);
        }
    }
    set(name, value) {
        const option = this.find(name);
        if (option) {
            option.value = value;
            return option;
        }
        else {
            throw new InstanceOptionsError(name, `Option with name not found`);
        }
    }
    get(name) {
        const option = this.find(name);
        if (option) {
            return option.value;
        }
        else {
            throw new InstanceOptionsError(name, `Option with name not found`);
        }
    }
    find(name) {
        return this.options.find(option => option.name === name);
    }
    push(option) {
        if (this.find(option.name)) {
            throw new InstanceOptionsError(option.name, `Option with name ${option.name} already exists`);
        }
        this.options.push(option);
    }
    injectDefaults(defaults) {
        for (const defaultOption of defaults.toArray()) {
            const option = this.find(defaultOption.name);
            if (option) {
                if (option.value === undefined) {
                    option.value = defaultOption.value ? defaultOption.value : defaultOption.defaultValue;
                }
                if (option.defaultValue === undefined) {
                    option.defaultValue = defaultOption.defaultValue;
                }
            }
            else {
                this.push(defaultOption);
            }
        }
    }
    toArray() {
        return this.options;
    }
    toParams() {
        return this.options.toParams();
    }
}
export { createOptionsList, InstanceOptions, InstanceOptionsList };
