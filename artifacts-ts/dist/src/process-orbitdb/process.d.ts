import { IProcess, Process } from '../process-interface/process.js';
import { PodProcessId } from '../id-reference-factory/IdReferenceClasses.js';
import { IProcessContainer } from '../process-interface/processContainer.js';
import { IProcessOption } from '../process-interface/processOptions.js';
import { IProcessCommand } from '../process-interface/processCommand.js';
/**
 * A class representing an OrbitDb process
 * @category OrbitDb
 */
declare class OrbitDbProcess extends Process implements IProcess {
    constructor({ id, container, options, commands }: {
        id: PodProcessId;
        container?: IProcessContainer;
        options?: Array<IProcessOption>;
        commands?: Array<IProcessCommand>;
    });
}
declare const createOrbitDbProcess: (id: PodProcessId, options?: Array<IProcessOption>) => Promise<OrbitDbProcess>;
export { createOrbitDbProcess, OrbitDbProcess };
//# sourceMappingURL=process.d.ts.map