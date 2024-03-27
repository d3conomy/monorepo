import { LogLevel, isLogLevel } from "./LogLevels.js";
/**
 * A class to represent a log entry
 * @category Logging
 */
class LogEntry {
    podId;
    processId;
    level;
    code;
    stage;
    timestamp;
    message;
    error;
    printLevel;
    constructor({ printLevel, podId, processId, message, level, code, stage, error }) {
        this.podId = podId;
        this.processId = processId;
        this.message = message;
        this.level = level ? isLogLevel(level) : LogLevel.INFO;
        this.code = code;
        this.stage = stage;
        this.timestamp = new Date();
        this.error = error;
        this.printLevel = printLevel ? isLogLevel(printLevel) : LogLevel.INFO;
        this.print(this.printLevel);
    }
    /**
     * Prints the log entry to the console
     */
    print = (printLevel) => {
        const timestamp = this.timestamp.toUTCString();
        const output = `[${timestamp}] ${this.message}`;
        switch (this.level) {
            case LogLevel.ERROR:
                if (printLevel === LogLevel.ERROR) {
                    console.error(output);
                }
                break;
            case LogLevel.WARN:
                if (printLevel === LogLevel.WARN ||
                    printLevel === LogLevel.ERROR) {
                    console.warn(output);
                }
                break;
            case LogLevel.INFO:
                if (printLevel === LogLevel.INFO ||
                    printLevel === LogLevel.WARN ||
                    printLevel === LogLevel.ERROR) {
                    console.info(output);
                }
                break;
            case LogLevel.DEBUG:
                if (printLevel === LogLevel.DEBUG ||
                    printLevel === LogLevel.INFO ||
                    printLevel === LogLevel.WARN ||
                    printLevel === LogLevel.ERROR) {
                    console.debug(output);
                }
                break;
            default:
                console.log(output);
                break;
        }
    };
}
export { LogEntry };
