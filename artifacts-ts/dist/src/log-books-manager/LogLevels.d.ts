/**
 * Log Levels
 * @category Logging
 */
declare enum LogLevel {
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    DEBUG = "debug"
}
/**
 * Check if a string is a valid log level
 * @category Utils
 */
declare const isLogLevel: (level?: string | LogLevel) => LogLevel;
export { LogLevel, isLogLevel };
//# sourceMappingURL=LogLevels.d.ts.map