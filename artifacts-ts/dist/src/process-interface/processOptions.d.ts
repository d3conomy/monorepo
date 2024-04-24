interface IProcessOption {
    name: string;
    description?: string;
    value?: any;
    required?: boolean;
    defaultValue?: any;
    toParam(): {
        [key: string]: any;
    };
}
interface IProcessOptionsList extends Array<IProcessOption> {
}
declare const createProcessOption: ({ name, description, value, required, defaultValue }: {
    name: string;
    description?: string | undefined;
    value?: any;
    required?: boolean | undefined;
    defaultValue?: any;
}) => ProcessOption;
declare const findProcessOption: ({ options, name }: {
    options: IProcessOptionsList | IProcessOption[] | {
        [key: string]: any;
    } | Map<string, any>;
    name: string;
}) => IProcessOption | undefined;
declare const compileProcessOptions: ({ values, options }: {
    values?: {
        [key: string]: any;
    } | undefined;
    options: IProcessOption[];
}) => {
    [key: string]: any;
};
declare class ProcessOption implements IProcessOption {
    name: string;
    description?: string;
    value?: any;
    required?: boolean;
    defaultValue?: any;
    constructor({ name, description, value, required, defaultValue }: {
        name: string;
        description?: string;
        value?: any;
        required?: boolean;
        defaultValue?: any;
    });
    toParam(): {
        [key: string]: any;
    };
}
declare class ProcessOptions extends Map<ProcessOption['name'], IProcessOption> {
    constructor(options: Array<IProcessOption> | IProcessOptionsList | Map<string, any> | Partial<ProcessOptions>);
    toParams(): {
        [key: string]: any;
    };
}
export { compileProcessOptions, createProcessOption, findProcessOption, IProcessOption, IProcessOptionsList, ProcessOption, ProcessOptions };
//# sourceMappingURL=processOptions.d.ts.map