
interface InstanceOption<T> {
    name: string;
    description?: string;
    value?: T;
    required?: boolean;
    defaultValue?: T;
}

class InstanceOptionsList extends Array<InstanceOption<any>> {
    constructor(options: InstanceOption<any>[]) {
        super(...options);
    }

    toParams(): { [key: string]: any } {
        let params: { [key: string]: any } = {};
        for (const option of this) {
            if (params.hasOwnProperty(option.name)) {
                params[option.name] = option.value;
            } else {
                params[option.name] = option.defaultValue;
            }
        }
        return params;
    }
}

export {
    InstanceOption,
    InstanceOptionsList
}