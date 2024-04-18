interface IProcessOption {
    name: string;
    description?: string;
    value?: any;
    required?: boolean;
    defaultValue?: any;
}
interface IProcessOptions extends Array<IProcessOption> {
}
declare const createProcessOption: ({ name, description, value, required, defaultValue }: {
    name: string;
    description?: string | undefined;
    value?: any;
    required?: boolean | undefined;
    defaultValue?: any;
}) => IProcessOption;
declare const compileProcessOptions: ({ values, options }: {
    values: Array<IProcessOption>;
    options: IProcessOptions;
}) => IProcessOptions;
declare const formatProcessOptions: (options: IProcessOptions) => Map<IProcessOption['name'], IProcessOption['value']>;
export { compileProcessOptions, createProcessOption, formatProcessOptions, IProcessOption, IProcessOptions };
//# sourceMappingURL=processOptions.d.ts.map