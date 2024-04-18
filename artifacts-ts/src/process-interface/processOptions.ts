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

const compileProcessOptions = ({
    values,
    options
}: {
    values: Array<IProcessOption>,
    options: IProcessOptions
}): IProcessOptions => {
    return options.map(option => {
        const value = values.find(value => value.name === option.name);
        if (!value) {
            return {
                ...option,
                value: option.value ? option.value : option.defaultValue
            }
        }
        return {
            ...option,
            value: value?.value ?? option.defaultValue
        }
    });
}

const formatProcessOptions = (options: IProcessOptions): Map<IProcessOption['name'], IProcessOption['value']> => {
    return new Map(options.map(option => [option.name, option.value]));
}

export {
    compileProcessOptions,
    createProcessOption,
    formatProcessOptions,
    IProcessOption,
    IProcessOptions
}