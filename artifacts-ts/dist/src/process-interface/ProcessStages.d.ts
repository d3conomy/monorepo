/**
 * Lunar Pod Process Stages
 * @category Process
 */
declare enum ProcessStage {
    NEW = "new",
    INIT = "init",
    STARTED = "started",
    STARTING = "starting",
    PENDING = "pending",
    COMPLETED = "completed",
    STOPPING = "stopping",
    STOPPED = "stopped",
    RESTARTING = "restarting",
    ERROR = "error",
    WARNING = "warning",
    UNKNOWN = "unknown"
}
/**
 * Check if a string is a valid process stage
 * @category Process
 */
declare const isProcessStage: (stage: string) => ProcessStage;
export { ProcessStage, isProcessStage };
//# sourceMappingURL=ProcessStages.d.ts.map