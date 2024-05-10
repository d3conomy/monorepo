import { InstanceOption, InstanceOptions } from "../container/options.js";

const moonbaseOptions = () => new InstanceOptions({ options: [
    {
        name: "createPodbay",
        description: "Create a PodBay upon startup",
        defaultValue: true
    } as InstanceOption<boolean>
]})

class MoonbaseOptions extends InstanceOptions {
    constructor(options?: InstanceOptions, defaults: boolean = true) {
        super({options, injectDefaults: defaults, defaults: moonbaseOptions()});
    }
}

export { moonbaseOptions, MoonbaseOptions };