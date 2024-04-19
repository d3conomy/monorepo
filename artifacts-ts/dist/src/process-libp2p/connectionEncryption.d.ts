import { IProcessOptions } from '../process-interface/index.js';
declare const connectionEncryptionOptions: IProcessOptions;
declare const connectionEncryption: ({ enableNoise, enableTls }?: {
    enableNoise?: boolean | undefined;
    enableTls?: boolean | undefined;
}) => any[];
export { connectionEncryption, connectionEncryptionOptions };
//# sourceMappingURL=connectionEncryption.d.ts.map