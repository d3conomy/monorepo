import { yamux } from '@chainsafe/libp2p-yamux';
import { mplex } from '@libp2p/mplex';
import { createProcessOption, injectDefaultValues, mapProcessOptions } from '../process-interface/index.js';
const streamMuxerOptions = () => [
    createProcessOption({
        name: 'enableYamux',
        description: 'Enable Yamux',
        defaultValue: true
    }),
    createProcessOption({
        name: 'enableMplex',
        description: 'Enable Mplex',
        defaultValue: false
    })
];
const streamMuxers = ({ ...values } = {}) => {
    const injectedDefaultValues = injectDefaultValues({ options: streamMuxerOptions(), values });
    const { enableYamux = true, enableMplex = false } = mapProcessOptions(injectedDefaultValues);
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
