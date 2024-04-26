const createProcessOption = ({ name, description, value, required, defaultValue }) => {
    return new ProcessOption({
        name,
        description,
        value,
        required,
        defaultValue
    });
};
const findProcessOption = ({ options, name }) => {
    if (options instanceof Array) {
        return options.find((option) => option.name === name);
    }
    else if (options instanceof Map) {
        return options.get(name);
    }
    else {
        return options[name];
    }
};
const injectDefaultValues = ({ options, values }) => {
    options.forEach((option) => {
        // console.log(`optionInjectDefaultValues: ${JSON.stringify(option)}`)
        if (values[option.name] !== undefined) {
            if (values[option.name].value !== undefined && values[option.name].value !== null) {
                option.value = values[option.name].value;
            }
            else if (values[option.name] !== undefined && values[option.name] !== null) {
                option.value = values[option.name];
            }
            else {
                option.value = option.defaultValue;
            }
        }
        if (option.value === undefined) {
            option.value = option.defaultValue;
        }
    });
    // console.log(`optionInjectDefaultValues[]: ${JSON.stringify(options)}`)
    return options;
    // return options.map((option: IProcessOption) => {
    //         console.log(`optionInjectDefaultValues: ${JSON.stringify(values[option.name].value)}`)
    //         option.value = values[option.name].value;
    //     if (option.value === undefined) {
    //         option.value = option.defaultValue;
    //     }
    //     console.log(`optionInjectDefaultValues: ${JSON.stringify(option)}`)
    //     return option;
    // });
};
const compileProcessOptions = (options) => {
    const formattedOptions = mapProcessOptions(options);
    return formattedOptions;
};
const mapProcessOptions = (options, asMap = false) => {
    let map = new Map();
    for (const option of options) {
        if (option.required && option.value === undefined) {
            option.value = option.defaultValue;
        }
        if (option.value?.value !== undefined || option.value?.defaultValue !== undefined) {
            option.value = option.value.value;
        }
        // console.log(`mapProcessOptions set: ${JSON.stringify(option.value)}`)
        map.set(option.name, option.value);
        // console.log(`mapMapProcessOptions: ${JSON.stringify(map.get(option.name))}`)
    }
    if (asMap) {
        return map;
    }
    return Object.fromEntries(map.entries());
};
const mapProcessOptionsParams = (options) => {
    let formattedOptions = new Map();
    for (const [optionName, optionValue] of options) {
        formattedOptions.set(optionName, optionValue);
    }
    return Object.fromEntries(formattedOptions);
};
class ProcessOption {
    name;
    description;
    value;
    required;
    defaultValue;
    constructor({ name, description, value, required, defaultValue }) {
        this.name = name;
        this.description = description;
        this.value = value;
        this.required = required;
        this.defaultValue = defaultValue;
    }
    toParam() {
        const paramvalue = this.value;
        if (this.value === undefined) {
            return {
                [this.name]: this.defaultValue
            };
        }
        return {
            [this.name]: this.value
        };
    }
}
class ProcessOptions extends Map {
    constructor(options) {
        if (options instanceof Array) {
            super(options.map(option => [option.name, option.value]));
        }
        else if (options instanceof Map || options instanceof ProcessOptions) {
            super(options.entries());
        }
    }
    toParams() {
        let params = {};
        for (const [key, value] of this) {
            if (value.value !== undefined) {
                params[key] = value.value;
            }
            else {
                params[key] = value.defaultValue;
            }
        }
        return params;
    }
}
export { compileProcessOptions, createProcessOption, findProcessOption, mapProcessOptions, mapProcessOptionsParams, injectDefaultValues, ProcessOption, ProcessOptions };
