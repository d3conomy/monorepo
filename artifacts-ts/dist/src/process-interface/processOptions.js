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
    return options.map((option) => {
        const value = values[option.name];
        option.value = value ? value : option.defaultValue;
        return option;
    });
};
const compileProcessOptions = (options) => {
    console.log(`options: ${JSON.stringify(options)}`);
    const formattedOptions = mapProcessOptions(options);
    console.log(`formattedOptions: ${JSON.stringify(formattedOptions)}`);
    return formattedOptions;
};
// const compileProcessOptions = ({
//     values,
//     options
// }: {
//     values?: { [key: string]: any },
//     options: IProcessOption[]
// }): { [key: string]: any } => {
//     if (!values) {
//         // return mapProcessOptionsParams(options) ;
//     }
//     let formattedOptions = new Map<string, any>();
//     for (const option of options) {
//         const inputValue = findProcessOption({ options: values ? values : options, name: option.name });
//         console.log(`inputValue: ${JSON.stringify(inputValue)}`)
//         const value = inputValue ? inputValue.value : option.value ? option.value : option.defaultValue;
//         option.value = value;
//         formattedOptions.set(option.name, option);
//     }
//     console.log(formattedOptions);
//     return mapProcessOptionsParams(formattedOptions);
// }
const mapProcessOptions = (options) => {
    // console.log(`optionsMapProcessOptions: ${JSON.stringify(options)}`)
    let map = new Map();
    for (const option of options) {
        console.log(`optionMapProcessOptions: ${JSON.stringify(option)}`);
        map.set(option.name, option.value);
        console.log(`mapMapProcessOptions: ${JSON.stringify(map.get(option.name))}`);
    }
    return Object.fromEntries(map.entries());
};
const mapProcessOptionsParams = (options) => {
    let formattedOptions = new Map();
    for (const [optionName, optionValue] of options) {
        formattedOptions.set(optionName, optionValue.value ? optionValue.value : optionValue.defaultValue);
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
export { compileProcessOptions, createProcessOption, findProcessOption, 
// mapProcessOptions,
// mapProcessOptionsParams,
injectDefaultValues, ProcessOption, ProcessOptions };
