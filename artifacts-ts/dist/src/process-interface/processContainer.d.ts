import { IProcessOptionsList } from "./processOptions";
import { ProcessType } from "./processTypes";
interface IProcessContainer<T = ProcessType> {
    type: T;
    instance?: any;
    options?: IProcessOptionsList;
    init?: (options?: IProcessOptionsList) => Promise<any>;
    loadInstance?: (instance?: any) => void;
}
declare class ProcessContainer<T = ProcessType> implements IProcessContainer<T> {
    type: T;
    instance?: any;
    options?: IProcessOptionsList;
    init?: (options?: IProcessOptionsList) => Promise<any>;
    constructor({ type, instance, options, init }: {
        type: T;
        instance?: any;
        options?: IProcessOptionsList;
        init?: (options?: IProcessOptionsList) => Promise<any>;
    });
    loadInstance(instance?: any): void;
}
declare const createProcessContainer: <T = ProcessType>({ type, instance, options, init }: {
    type: T;
    instance?: any;
    options?: IProcessOptionsList | undefined;
    init?: ((options?: IProcessOptionsList) => Promise<any>) | undefined;
}) => ProcessContainer<T>;
export { createProcessContainer, IProcessContainer };
//# sourceMappingURL=processContainer.d.ts.map