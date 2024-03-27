/**
 * Log Levels
 * @category Logging
 */
var LogLevel;
(function (LogLevel) {
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
    LogLevel["DEBUG"] = "debug";
})(LogLevel || (LogLevel = {}));
/**
 * Check if a string is a valid log level
 * @category Utils
 */
const isLogLevel = (level = 'info') => {
    if (typeof level === 'string') {
        level = level.toLowerCase();
    }
    if (Object.values(LogLevel).includes(level)) {
        return level;
    }
    throw new Error('Invalid log level');
};
export { LogLevel, isLogLevel };
