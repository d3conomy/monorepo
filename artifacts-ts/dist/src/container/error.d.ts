import { ContainerId } from "../id-reference-factory/index.js";
declare class ContainerError extends Error {
    containerId?: ContainerId;
    constructor(message: string, containerId?: ContainerId);
}
export { ContainerError };
//# sourceMappingURL=error.d.ts.map