interface InstanceOption<T> {
    name: string;
    description?: string;
    value?: T;
    required?: boolean;
    defaultValue?: T;
}
declare class InstanceOptionsList extends Array<InstanceOption<any>> {
    constructor(options: Array<InstanceOption<any>>);
    toParams(): {
        [key: string]: any;
    };
}
declare class InstanceOptions {
    options: InstanceOptionsList;
    constructor(options: Array<InstanceOption<any>> | InstanceOptionsList, injectDefaults?: boolean, defaults?: InstanceOptionsList);
    find(name: string): InstanceOption<any> | undefined;
    push(option: InstanceOption<any>): void;
    injectDefaults(defaults: InstanceOptionsList): void;
    toParams(): {
        [key: string]: any;
    };
}
export { InstanceOption, InstanceOptions, InstanceOptionsList };
//# sourceMappingURL=options.d.ts.map