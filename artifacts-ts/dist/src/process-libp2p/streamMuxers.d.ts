import { IProcessOptions } from '../process-interface';
declare const streamMuxerOptions: IProcessOptions;
declare const streamMuxers: ({ enableYamux, enableMplex }?: {
    enableYamux?: boolean | undefined;
    enableMplex?: boolean | undefined;
}) => any[];
export { streamMuxers, streamMuxerOptions };
//# sourceMappingURL=streamMuxers.d.ts.map