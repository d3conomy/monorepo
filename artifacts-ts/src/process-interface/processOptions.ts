interface IProcessOption {
    name: string;
    description?: string;
    value?: any;
    required?: boolean;
    defaultValue?: any;

    toParam(): { [key: string]: any }
}

interface IProcessOptionsList extends Array<IProcessOption>{
}

const createProcessOption = ({
    name,
    description,
    value,
    required,
    defaultValue
}: {
    name: string,
    description?: string,
    value?: any,
    required?: boolean
    defaultValue?: any
}): ProcessOption => {
    return new ProcessOption({
        name,
        description,
        value,
        required,
        defaultValue
    });
}

const findProcessOption = ({
    options,
    name
}: {
    options: IProcessOptionsList | Array<IProcessOption> | { [key: string]: any } | Map<string, any>,
    name: string
}): IProcessOption | undefined => {
    if (options instanceof Array) {
        return options.find((option: IProcessOption) => option.name === name);
    }
    else if (options instanceof Map) {
        return options.get(name);
    }
    else {
        return options[name];
    }
}

const injectDefaultValues = ({
    options,
    values
}: {
    options: IProcessOptionsList,
    values: { [key: string]: any }
}): IProcessOptionsList => {
    return options.map((option: IProcessOption) => {
        const value = values[option.name];
        option.value = value ? value : option.defaultValue;
        return option;
    });
}

const compileProcessOptions = (options: IProcessOptionsList | IProcessOption[]): { [key: string]: any } => {
    console.log(`options: ${JSON.stringify(options)}`)
    const formattedOptions = mapProcessOptions(options);
    console.log(`formattedOptions: ${JSON.stringify(formattedOptions)}`)
    return formattedOptions;
}


const mapProcessOptions = (options: IProcessOptionsList): any => {
    // console.log(`optionsMapProcessOptions: ${JSON.stringify(options)}`)
    let map: Map<string, any> = new Map();
    for (const option of options) {
        console.log(`optionMapProcessOptions: ${JSON.stringify(option)}`)
        map.set(option.name, option.value);
        console.log(`mapMapProcessOptions: ${JSON.stringify(map.get(option.name))}`)
    }
    return Object.fromEntries(map.entries());
}

const mapProcessOptionsParams = (options: Map<string, IProcessOption>): { [key: string]: any} => {
    let formattedOptions = new Map<string, any>();
    for (const [optionName, optionValue ] of options) {
        formattedOptions.set(optionName, optionValue.value ? optionValue.value : optionValue.defaultValue);
    }
    return Object.fromEntries(formattedOptions);
}



class ProcessOption implements IProcessOption {
    name: string;
    description?: string;
    value?: any;
    required?: boolean;
    defaultValue?: any;

    constructor({
        name,
        description,
        value,
        required,
        defaultValue
    }: {
        name: string,
        description?: string,
        value?: any,
        required?: boolean
        defaultValue?: any
    }) {
        this.name = name;
        this.description = description;
        this.value = value;
        this.required = required;
        this.defaultValue = defaultValue;
    }

    toParam(): { [key: string]: any } {
        return {
            [this.name]: this.value ? this.value : this.defaultValue
        }
    }
}

class ProcessOptions extends Map<ProcessOption['name'], IProcessOption>{
    constructor(options: Array<IProcessOption> | IProcessOptionsList | Map<string, any> | Partial<ProcessOptions>) {
        if (options instanceof Array) {
            super(options.map(option => [option.name, option.value ? option.value : option.defaultValue]));
        }
        else if (options instanceof Map || options instanceof ProcessOptions) {
            super(options.entries());
        }
    }

    toParams(): { [key: string]: any } {
        let params: { [key: string]: any } = {};
        for (const [key, value] of this) {
            params[key] = value.value ? value.value : value.defaultValue;
        }
        return params;
    }
}




export {
    compileProcessOptions,
    createProcessOption,
    findProcessOption,
    // mapProcessOptions,
    // mapProcessOptionsParams,
    injectDefaultValues,
    IProcessOption,
    IProcessOptionsList,
    ProcessOption,
    ProcessOptions
}