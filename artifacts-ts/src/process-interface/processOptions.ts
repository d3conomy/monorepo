interface IProcessOption {
    name: string;
    description?: string;
    value?: any;
    required?: boolean;
}

interface IProcessOptions extends Array<IProcessOption>{
}

const createProcessOption = ({
    name,
    description,
    value,
    required
}: {
    name: string,
    description?: string,
    value?: any,
    required?: boolean
}): IProcessOption => {
    return {
        name,
        description,
        value,
        required
    }
}

export {
    createProcessOption,
    IProcessOption,
    IProcessOptions
}