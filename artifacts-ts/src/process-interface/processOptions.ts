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

const formatProcessOptions = (options: IProcessOptions): any => {
    return options.reduce((acc:any, option:any) => {
        acc[option.name] = option.value;
        return acc;
    }, {});
}

export {
    compileProcessOptions,
    createProcessOption,
    formatProcessOptions,
    IProcessOption,
    IProcessOptions
}