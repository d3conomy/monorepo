import { IProcessContainer } from './processContainer.js';
import { IProcessCommands } from './processCommand.js';
declare const importFromFile: (filepath: string) => Promise<any>;
declare const importProcessContainerFromJSON: (json: any) => IProcessContainer;
declare const importProcessCommandsFromJSON: (container: IProcessContainer, json: any) => IProcessCommands;
export { importFromFile, importProcessContainerFromJSON, importProcessCommandsFromJSON };
//# sourceMappingURL=processImport.d.ts.map