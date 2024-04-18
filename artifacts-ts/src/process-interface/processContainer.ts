import { IProcessOptions } from "./processOptions"
import { ProcessType } from "./processTypes"



interface IProcessContainer<T = ProcessType> {
    type: T
    process?: any
    options?: IProcessOptions

    init?: (options?: IProcessOptions) => Promise<void>
}

const createProcessContainer = <T = ProcessType>(
    type: T,
    process?: any,
    options?: IProcessOptions,
    init?: (options?: IProcessOptions) => Promise<void>
): IProcessContainer<T> => {
    return {
        type,
        process,
        options,
        init
    }
    
}

export {
    createProcessContainer,
    IProcessContainer
}