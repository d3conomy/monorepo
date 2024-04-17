import { ProcessType } from "./processTypes"



interface IProcessContainer<T = ProcessType> {
    type: T
    process?: any
}

export {
    IProcessContainer
}