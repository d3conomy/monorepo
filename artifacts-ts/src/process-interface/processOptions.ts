interface IProcessOption {
    name: string;
    description?: string;
    value?: any;
    required?: boolean;
    defaultValue?: any;
}

interface IProcessOptions extends Array<IProcessOption>{
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
}): IProcessOption => {
    return {
        name,
        description,
        value,
        required,
        defaultValue
    }
}

const findProcessOption = ({
    options,
    name
}: {
    options: IProcessOptions | Array<IProcessOption>,
    name: string
}): IProcessOption | undefined => {
    if (options instanceof Array) {
        return options.find((option: IProcessOption) => option.name === name);
    }
}


const compileProcessOptions = ({
    values,
    options
}: {
    values?: Array<IProcessOption>,
    options: IProcessOptions
}): IProcessOptions => {
    if (!values) {
        return options.map(option => {
            return {
                ...option,
                value: option.value ? option.value : option.defaultValue
            }
        });
    }

    return options.map((option: IProcessOption) => {
        let defaultValue = option.defaultValue ? option.defaultValue : undefined;
        const optionsValue = option.value ? option.value : undefined;

        if (!defaultValue && optionsValue) {
            defaultValue = optionsValue;
        }

        const value: IProcessOption | undefined | any = findProcessOption({options: values, name: option.name});
        
        if (value !== undefined && value !== null) {
            return {
                ...option,
                value: value.value ? value.value : defaultValue
            }
        }
        return {
            ...option,
            value: defaultValue
        }
    });
}

const formatProcessOptions = (options: IProcessOptions): any => {
    let formattedOptions: any = new Map();
    for (const option of options) {
        formattedOptions.set(option.name, option);
    }
    return formattedOptions;
}

export {
    compileProcessOptions,
    createProcessOption,
    formatProcessOptions,
    IProcessOption,
    IProcessOptions
}