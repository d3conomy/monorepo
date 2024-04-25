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
        if (values[option.name] !== undefined) {
            if (values[option.name].value !== undefined) {
                option.value = values[option.name].value;
            }
            else {
                option.value = values[option.name];
            }
        }
        if (option.value === undefined) {
            option.value = option.defaultValue;
        }
    });
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
const mapProcessOptions = (options) => {
    let map = new Map();
    for (const option of options) {
        const formattedOption = option.toParam();
        map.set(option.name, formattedOption[option.name]);
        // console.log(`mapMapProcessOptions: ${JSON.stringify(map.get(option.name))}`)
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
