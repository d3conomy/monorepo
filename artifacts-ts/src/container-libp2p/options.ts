import { InstanceOption, InstanceOptionsList } from "../container/options.js";
import { bootstrapOptions } from './bootstrap.js';

const buildOptionsConfig = (): InstanceOptionsList => {
    return new InstanceOptionsList([
        {
            name: 'bootstrap',
            description: 'Bootstrap configuration',
            defaultValue: bootstrapOptions()
        } as InstanceOption<InstanceOptionsList>
    ])
}

const buildOptions = async

