import { IProcessOptions } from "./processOptions";
import { ProcessType } from "./processTypes";
interface IProcessContainer<T = ProcessType> {
    type: T;
    process?: any;
    options?: IProcessOptions;
    init?: (options?: IProcessOptions) => Promise<void>;
}
declare const createProcessContainer: <T = ProcessType>(type: T, process?: any, options?: IProcessOptions, init?: ((options?: IProcessOptions) => Promise<void>) | undefined) => IProcessContainer<T>;
export { createProcessContainer, IProcessContainer };
//# sourceMappingURL=processContainer.d.ts.map