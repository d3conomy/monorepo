/**
 * Lunar Pod Process Stages
 * @category Process
 */
enum ProcessStage {
    NEW = 'new',
    INITIALIZING = 'initializing',
    INITIALIZED = 'initialized',
    STARTED = 'started',
    STARTING = 'starting',
    PENDING = 'pending',
    COMPLETED = 'completed',
    STOPPING = 'stopping',
    STOPPED = 'stopped',
    RESTARTING = 'restarting',
    ERROR = 'error',
    WARNING = 'warning',
    UNKNOWN = 'unknown',
}

/**
 * Check if a string is a valid process stage
 * @category Process
 */
const isProcessStage = (stage: string): ProcessStage => {
    if (Object.values(ProcessStage).includes(stage as ProcessStage)) {
        return stage as ProcessStage;
    }
    else if (stage === undefined) {
        return ProcessStage.UNKNOWN;
    }
    throw new Error('Invalid process stage');
}

export {
    ProcessStage,
    isProcessStage
}