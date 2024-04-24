import { yamux } from '@chainsafe/libp2p-yamux';
import { mplex } from '@libp2p/mplex';
import { createProcessOption } from '../process-interface/index.js';
const streamMuxerOptions = [
    createProcessOption({
        name: 'enableYamux',
        description: 'Enable Yamux',
        required: false,
        defaultValue: true
    }),
    createProcessOption({
        name: 'enableMplex',
        description: 'Enable Mplex',
        required: false,
        defaultValue: false
    })
];
const streamMuxers = ({ enableYamux = true, enableMplex = false } = {}) => {
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
