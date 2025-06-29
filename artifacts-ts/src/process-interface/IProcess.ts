/**
 * Process stages for tracking the lifecycle of processes
 * @category Process
 */
enum ProcessStage {
    NEW = "new",
    INITIALIZING = "initializing", 
    INITIALIZED = "initialized",
    STARTING = "starting",
    STARTED = "started",
    STOPPING = "stopping",
    STOPPED = "stopped",
    RESTARTING = "restarting",
    ERROR = "error"
}

/**
 * Type guard to check if a value is a valid ProcessStage
 * @param value - The value to check
 * @returns True if the value is a ProcessStage
 */
const isProcessStage = (value: any): ProcessStage => {
    if (Object.values(ProcessStage).includes(value)) {
        return value as ProcessStage;
    }
    return ProcessStage.NEW;
};

/**
 * Interface for processes that can be managed (started, stopped, restarted)
 * @category Process
 */
interface IProcess {
    /**
     * Check if the process exists and is valid
     */
    checkProcess(): boolean;

    /**
     * Initialize the process
     */
    init(): Promise<void>;

    /**
     * Start the process
     */
    start(): Promise<void>;

    /**
     * Stop the process
     */
    stop(): Promise<void>;

    /**
     * Restart the process
     */
    restart(): Promise<void>;

    /**
     * Get the current status of the process
     */
    status(): ProcessStage;
}

export {
    IProcess,
    ProcessStage,
    isProcessStage
};
