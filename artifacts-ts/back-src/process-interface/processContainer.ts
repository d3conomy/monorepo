import { IProcessOptionsList, ProcessOptions } from "./processOptions"
import { ProcessType } from "./processTypes"


interface TypeMapping {
    [ProcessType.IPFS]: ProcessType.IPFS;
    [ProcessType.LIBP2P]: ProcessType.LIBP2P;
    [ProcessType.OPEN_DB]: ProcessType.OPEN_DB;
    [ProcessType.ORBITDB]: ProcessType.ORBITDB;
    [ProcessType.CUSTOM]: ProcessType.CUSTOM;
}

interface IProcessContainer<T = ProcessType> {
    type: T
    instance?: any
    options?: IProcessOptionsList | ProcessOptions

    init?: (options?: any) => Promise<any>
    loadInstance(instance?: any): void
}


class ProcessContainer<T> implements IProcessContainer<T> {
    type: T
    instance?: any
    options?: IProcessOptionsList | ProcessOptions
    init?: (options?: any) => Promise<any>

    constructor({
        // type,
        instance,
        options,
        init
    } : {
        // type?: T,
        instance?: any,
        options?: IProcessOptionsList | ProcessOptions,
        init?: (options?: any) => Promise<any>
    }) {
        this.type = instance.constructor.name as T; // Set type from TypeMapping
        this.instance = instance;
        this.options = options;
        this.init = init;
    }

    loadInstance(instance?: any): void {
        this.instance = instance
    }
}

const createProcessContainer = <T>({
    // type,
    instance,
    options,
    init
} : {
    // type: T,
    instance?: any,
    options?: IProcessOptionsList | ProcessOptions,
    init?: (options?: any) => Promise<any>
}): ProcessContainer<T> => {
    return new ProcessContainer<T>({
        // type,
        instance,
        options,
        init
    })

    
}

export {
    createProcessContainer,
    IProcessContainer
}