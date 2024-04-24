import { IProcessOptionsList } from "./processOptions";
import { ProcessType } from "./processTypes";
interface IProcessContainer<T = ProcessType> {
    type: T;
    process?: any;
    options?: IProcessOptionsList;
    init?: (options?: IProcessOptionsList) => Promise<any>;
    loadProcess?: (process: any) => void;
}
declare class ProcessContainer<T = ProcessType> implements IProcessContainer<T> {
    type: T;
    process?: any;
    options?: IProcessOptionsList;
    init?: (options?: IProcessOptionsList) => Promise<any>;
    constructor({ type, process, options, init }: {
        type: T;
        process?: any;
        options?: IProcessOptionsList;
        init?: (options?: IProcessOptionsList) => Promise<any>;
    });
    loadProcess(process: any): void;
}
declare const createProcessContainer: <T = ProcessType>({ type, process, options, init }: {
    type: T;
    process?: any;
    options?: IProcessOptionsList | undefined;
    init?: ((options?: IProcessOptionsList) => Promise<any>) | undefined;
}) => ProcessContainer<T>;
export { createProcessContainer, IProcessContainer };
//# sourceMappingURL=processContainer.d.ts.map