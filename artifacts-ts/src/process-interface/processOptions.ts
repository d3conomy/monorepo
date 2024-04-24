import { Process } from "./process";

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


const compileProcessOptions = ({
    values,
    options
}: {
    values?: { [key: string]: any },
    options: IProcessOption[]
}): { [key: string]: any } => {
    if (!values) {
        return { ...mapProcessOptionsParams(options) } ;
    }
    let formattedOptions = new Map<string, any>();

    

    for (const option of options) {
        const inputValue = findProcessOption({ options: values ? values : options, name: option.name });
        const value = inputValue ? inputValue.value : option.value ? option.value : option.defaultValue;
        option.value = value;

        formattedOptions.set(option.name, option);
    }
    return { ...mapProcessOptionsParams(formattedOptions) };
}

// const mapProcessOptions = (options: IProcessOptionsList): Map<string, any> => {
//     let formattedOptions = new Map<string, any>();
//     for (const option of options) {
//         formattedOptions.set(option.name, option);
//     }
//     return formattedOptions;
// }

const mapProcessOptionsParams = (options: any): { [key: string]: any} => {
    let formattedOptions = new Map<string, any>();
    for (const option of options) {
        formattedOptions.set(option.name, option.value ? option.value : option.defaultValue);
    }
    return { ...formattedOptions.entries() };
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
    // injectDefaultValues,
    IProcessOption,
    IProcessOptionsList,
    ProcessOption,
    ProcessOptions
}