interface IProcessOption {
    name: string;
    description?: string;
    value?: any;
    required?: boolean;
}
interface IProcessOptions extends Array<IProcessOption> {
}
declare const createProcessOption: ({ name, description, value, required }: {
    name: string;
    description?: string | undefined;
    value?: any;
    required?: boolean | undefined;
}) => IProcessOption;
export { createProcessOption, IProcessOption, IProcessOptions };
//# sourceMappingURL=processOptions.d.ts.map