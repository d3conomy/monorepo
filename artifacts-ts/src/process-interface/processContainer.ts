import { IProcessOptions } from "./processOptions"
import { ProcessType } from "./processTypes"



interface IProcessContainer<T = ProcessType> {
    type: T
    process?: any
    options?: IProcessOptions
}

const createProcessContainer = <T = ProcessType>(
    type: T,
    process?: any,
    options?: IProcessOptions
): IProcessContainer<T> => {
    return {
        type,
        process,
        options
    }
}

export {
    createProcessContainer,
    IProcessContainer
}