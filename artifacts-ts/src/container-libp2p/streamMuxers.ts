import { } from '@libp2p/interfaces'
import { yamux } from '@chainsafe/libp2p-yamux'
import { mplex } from '@libp2p/mplex'
import { InstanceOption, InstanceOptions, createOptionsList } from '../container/options.js'



const streamMuxerOptions = (): InstanceOptions => {
    return new InstanceOptions({options: [
        {
            name: 'enableYamux',
            description: 'Enable Yamux',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'enableMplex',
            description: 'Enable Mplex',
            defaultValue: false
        } as InstanceOption<boolean>
    ]})
} 

const streamMuxers = (options: InstanceOptions): Array<any> => {

    const {
        enableYamux = true,
        enableMplex = false
    } = options.toParams()
    
    let streamMuxers: Array<any> = new Array<any>()

    if (enableYamux === true) {
        streamMuxers.push(yamux())
    }

    if (enableMplex === true) {
        streamMuxers.push(mplex())
    }

    return streamMuxers
}

export {
    streamMuxers,
    streamMuxerOptions
}