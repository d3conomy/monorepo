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
const compileProcessOptions = ({ values, options }) => {
    if (!values) {
        return { ...mapProcessOptionsParams(options) };
    }
    let formattedOptions = new Map();
    for (const option of options) {
        const inputValue = findProcessOption({ options: values ? values : options, name: option.name });
        const value = inputValue ? inputValue.value : option.value ? option.value : option.defaultValue;
        option.value = value;
        formattedOptions.set(option.name, option);
    }
    return { ...mapProcessOptionsParams(formattedOptions) };
};
// const mapProcessOptions = (options: IProcessOptionsList): Map<string, any> => {
//     let formattedOptions = new Map<string, any>();
//     for (const option of options) {
//         formattedOptions.set(option.name, option);
//     }
//     return formattedOptions;
// }
const mapProcessOptionsParams = (options) => {
    let formattedOptions = new Map();
    for (const option of options) {
        formattedOptions.set(option.name, option.value ? option.value : option.defaultValue);
    }
    return { ...formattedOptions.entries() };
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
        return {
            [this.name]: this.value ? this.value : this.defaultValue
        };
    }
}
class ProcessOptions extends Map {
    constructor(options) {
        if (options instanceof Array) {
            super(options.map(option => [option.name, option.value ? option.value : option.defaultValue]));
        }
        else if (options instanceof Map || options instanceof ProcessOptions) {
            super(options.entries());
        }
    }
    toParams() {
        let params = {};
        for (const [key, value] of this) {
            params[key] = value.value ? value.value : value.defaultValue;
        }
        return params;
    }
}
export { compileProcessOptions, createProcessOption, findProcessOption, ProcessOption, ProcessOptions };
