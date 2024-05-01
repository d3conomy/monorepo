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
declare const createOptionsList: (options: Array<InstanceOption<any>>) => InstanceOptionsList;
declare class InstanceOptions {
    options: InstanceOptionsList;
    constructor({ options, injectDefaults, defaults }?: {
        options?: InstanceOptionsList | InstanceOptions;
        injectDefaults?: boolean;
        defaults?: InstanceOptions;
    });
    set(name: string, value: any): InstanceOption<any>;
    find(name: string): InstanceOption<any> | undefined;
    push(option: InstanceOption<any>): void;
    injectDefaults(defaults: InstanceOptions): void;
    toArray(): Array<InstanceOption<any>>;
    toParams(): {
        [key: string]: any;
    };
}
export { createOptionsList, InstanceOption, InstanceOptions, InstanceOptionsList };
//# sourceMappingURL=options.d.ts.map