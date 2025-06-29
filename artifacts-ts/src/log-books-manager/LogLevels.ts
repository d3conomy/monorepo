
/**
 * Log Levels
 * @category Logging
 */
enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    FATAL = 'fatal'
}

/**
 * Check if a string is a valid log level
 * @category Utils
 */
const isLogLevel = (level: string | LogLevel = 'info'): LogLevel => {
    if (typeof level === 'string') {
        level = level.toLowerCase();
    }

    if (Object.values(LogLevel).includes(level as LogLevel)) {
        return level as LogLevel;
    }
    throw new Error('Invalid log level');
}

export {
    LogLevel,
    isLogLevel
}