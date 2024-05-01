import { InstanceOptionsList } from "../container/options.js";
import { bootstrapOptions } from './bootstrap.js';
const buildOptionsConfig = () => {
    return new InstanceOptionsList([
        {
            name: 'bootstrap',
            description: 'Bootstrap configuration',
            defaultValue: bootstrapOptions()
        }
    ]);
};
// const buildOptions = async
