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
    options.forEach((option: IProcessOption) => {

        // console.log(`optionInjectDefaultValues: ${JSON.stringify(option)}`)
        if (values[option.name] !== undefined) {
            if (values[option.name].value !== undefined && values[option.name].value !== null) {
                option.value = values[option.name].value;
            }
            else if (values[option.name] !== undefined && values[option.name] !== null){
                option.value = values[option.name];
            }
            else {
                option.value = option.defaultValue;
            }
            
        }

        if (option.value === undefined) {
            option.value = option.defaultValue;
        }
    })
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
}

const compileProcessOptions = (options: IProcessOptionsList | IProcessOption[]): { [key: string]: any } => {
    const formattedOptions = mapProcessOptions(options);
    return formattedOptions;
}


const mapProcessOptions = (options: IProcessOptionsList, asMap: boolean = false): any => {
   
    let map: Map<string, any> = new Map();
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
}

const mapProcessOptionsParams = (options: Map<string, any>): { [key: string]: any} => {
    let formattedOptions = new Map<string, any>();
    for (const [optionName, optionValue ] of options) {
        formattedOptions.set(optionName, optionValue);
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
        const paramvalue = this.value

        if (this.value === undefined) {
            return {
                [this.name]: this.defaultValue
            }
        }

        return {
            
            [this.name]: this.value
        }
    }
}

class ProcessOptions extends Map<ProcessOption['name'], IProcessOption>{
    constructor(options: Array<IProcessOption> | IProcessOptionsList | Map<string, any> | Partial<ProcessOptions>) {
        if (options instanceof Array) {
            super(options.map(option => [option.name, option.value]));
        }
        else if (options instanceof Map || options instanceof ProcessOptions) {
            super(options.entries());
        }
    }

    toParams(): { [key: string]: any } {
        let params: { [key: string]: any } = {};
        for (const [key, value] of this) {
            if (value.value !== undefined) {
                params[key] = value.value
            }
            else {
                params[key] = value.defaultValue
            }
    
            
        }
        return params;
    }
}




export {
    compileProcessOptions,
    createProcessOption,
    findProcessOption,
    mapProcessOptions,
    mapProcessOptionsParams,
    injectDefaultValues,
    IProcessOption,
    IProcessOptionsList,
    ProcessOption,
    ProcessOptions
}