import { yamux } from '@chainsafe/libp2p-yamux';
import { mplex } from '@libp2p/mplex';
const streamMuxerOptions = [
    {
        name: 'enableYamux',
        description: 'Enable Yamux',
        required: false,
        defaultValue: true
    },
    {
        name: 'enableMplex',
        description: 'Enable Mplex',
        required: false,
        defaultValue: false
    }
];
const streamMuxers = ({ enableYamux = true, enableMplex = false } = {}) => {
    let streamMuxers = new Array();
    if (enableYamux) {
        streamMuxers.push(yamux());
    }
    if (enableMplex) {
        streamMuxers.push(mplex());
    }
    return streamMuxers;
};
export { streamMuxers, streamMuxerOptions };
