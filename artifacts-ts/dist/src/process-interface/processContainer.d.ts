import { IProcessOptions } from "./processOptions";
import { ProcessType } from "./processTypes";
interface IProcessContainer<T = ProcessType> {
    type: T;
    process?: any;
    options?: IProcessOptions;
}
declare const createProcessContainer: <T = ProcessType>(type: T, process?: any, options?: IProcessOptions) => IProcessContainer<T>;
export { createProcessContainer, IProcessContainer };
//# sourceMappingURL=processContainer.d.ts.map