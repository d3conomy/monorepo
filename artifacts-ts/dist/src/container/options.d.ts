interface InstanceOption<T> {
    name: string;
    description?: string;
    value?: T;
    required?: boolean;
    defaultValue?: any;
}
interface InstanceOptionsList extends Array<InstanceOption<any>> {
}
export { InstanceOption, InstanceOptionsList };
//# sourceMappingURL=options.d.ts.map