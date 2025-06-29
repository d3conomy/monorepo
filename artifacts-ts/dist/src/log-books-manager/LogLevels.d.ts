/**
 * Log Levels
 * @category Logging
 */
declare enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    FATAL = "fatal"
}
/**
 * Check if a string is a valid log level
 * @category Utils
 */
declare const isLogLevel: (level?: string | LogLevel) => LogLevel;
export { LogLevel, isLogLevel };
//# sourceMappingURL=LogLevels.d.ts.map