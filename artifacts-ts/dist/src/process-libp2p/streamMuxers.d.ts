import { IProcessOptionsList } from '../process-interface/index.js';
declare const streamMuxerOptions: IProcessOptionsList;
declare const streamMuxers: ({ enableYamux, enableMplex }?: {
    enableYamux?: boolean | undefined;
    enableMplex?: boolean | undefined;
}) => any[];
export { streamMuxers, streamMuxerOptions };
//# sourceMappingURL=streamMuxers.d.ts.map