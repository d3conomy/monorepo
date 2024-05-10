import { InstanceOptions } from "../container/options.js";
const moonbaseOptions = () => new InstanceOptions({ options: [
        {
            name: "createPodbay",
            description: "Create a PodBay upon startup",
            defaultValue: true
        }
    ] });
class MoonbaseOptions extends InstanceOptions {
    constructor(options, defaults = true) {
        super({ options, injectDefaults: defaults, defaults: moonbaseOptions() });
    }
}
export { moonbaseOptions, MoonbaseOptions };
