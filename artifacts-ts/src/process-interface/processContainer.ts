import { IProcessOptionsList } from "./processOptions"
import { ProcessType } from "./processTypes"



interface IProcessContainer<T = ProcessType> {
    type: T
    instance?: any
    options?: IProcessOptionsList

    init?: (options?: IProcessOptionsList) => Promise<any>
    loadInstance?: (instance: any) => void
}


class ProcessContainer<T = ProcessType> implements IProcessContainer<T> {
    type: T
    instance?: any
    options?: IProcessOptionsList
    init?: (options?: IProcessOptionsList) => Promise<any>

    constructor({
        type,
        instance,
        options,
        init
    } : {
        type: T,
        instance?: any,
        options?: IProcessOptionsList,
        init?: (options?: IProcessOptionsList) => Promise<any>
    }) {
        this.type = type
        this.instance = instance
        this.options = options
        this.init = init
    }

    loadInstance(instance: any): void {
        this.instance = instance
    }
}

const createProcessContainer = <T = ProcessType>({
    type,
    instance,
    options,
    init
} : {
    type: T,
    instance?: any,
    options?: IProcessOptionsList,
    init?: (options?: IProcessOptionsList) => Promise<any>
}): ProcessContainer<T> => {
    return new ProcessContainer<T>({
        type,
        instance,
        options,
        init
    })

    
}

export {
    createProcessContainer,
    IProcessContainer
}