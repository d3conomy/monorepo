import { yamux } from '@chainsafe/libp2p-yamux';
import { mplex } from '@libp2p/mplex';
import { InstanceOptions, createOptionsList } from '../container/options.js';
const streamMuxerOptions = () => {
    return new InstanceOptions({ options: createOptionsList([
            {
                name: 'enableYamux',
                description: 'Enable Yamux',
                defaultValue: true
            },
            {
                name: 'enableMplex',
                description: 'Enable Mplex',
                defaultValue: false
            }
        ]) });
};
const streamMuxers = (options) => {
    const { enableYamux = true, enableMplex = false } = options.toParams();
    let streamMuxers = new Array();
    if (enableYamux === true) {
        streamMuxers.push(yamux());
    }
    if (enableMplex === true) {
        streamMuxers.push(mplex());
    }
    return streamMuxers;
};
export { streamMuxers, streamMuxerOptions };
