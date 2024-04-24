import { IProcessOptionsList } from "./processOptions"
import { ProcessType } from "./processTypes"



interface IProcessContainer<T = ProcessType> {
    type: T
    process?: any
    options?: IProcessOptionsList

    init?: (options?: IProcessOptionsList) => Promise<any>
    loadProcess?: (process: any) => void
}


class ProcessContainer<T = ProcessType> implements IProcessContainer<T> {
    type: T
    process?: any
    options?: IProcessOptionsList
    init?: (options?: IProcessOptionsList) => Promise<any>

    constructor({
        type,
        process,
        options,
        init
    } : {
        type: T,
        process?: any,
        options?: IProcessOptionsList,
        init?: (options?: IProcessOptionsList) => Promise<any>
    }) {
        this.type = type
        this.process = process
        this.options = options
        this.init = init
    }

    loadProcess(process: any): void {
        this.process = process
    }
}

const createProcessContainer = <T = ProcessType>({
    type,
    process,
    options,
    init
} : {
    type: T,
    process?: any,
    options?: IProcessOptionsList,
    init?: (options?: IProcessOptionsList) => Promise<any>
}): ProcessContainer<T> => {
    return new ProcessContainer<T>({
        type,
        process,
        options,
        init
    })

    
}

export {
    createProcessContainer,
    IProcessContainer
}