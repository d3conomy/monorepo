import { IProcessOptions } from "./processOptions"
import { ProcessType } from "./processTypes"



interface IProcessContainer<T = ProcessType> {
    type: T
    process?: any
    options?: IProcessOptions

    init?: (options?: IProcessOptions) => Promise<any>
}

const createProcessContainer = <T = ProcessType>(
    type: T,
    process?: any,
    options?: IProcessOptions,
    init?: (options?: IProcessOptions) => Promise<any>
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