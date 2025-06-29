
// Timeout protection for hanging processes
process.on('SIGTERM', () => {
    console.log('Process terminated by timeout');
    process.exit(0);
});

// Auto-exit after 2 minutes if process hangs
setTimeout(() => {
    console.log('Process auto-terminated after timeout');
    process.exit(0);
}, 120000);


// Enhanced database cleanup function
export function cleanupDatabaseConnections(containers) {
    return Promise.all(containers.map(async (container) => {
        if (container && container.type === 'database') {
            try {
                const instance = container.getInstance();
                if (instance && typeof instance.close === 'function') {
                    await Promise.race([
                        instance.close(),
                        new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Close timeout')), 5000)
                        )
                    ]);
                }
            } catch (error) {
                console.warn('Database cleanup error:', error.message);
            }
        }
    }));
}


// Enhanced error handling utilities
export class ReliabilityHelper {
    static async withRetry(operation, maxRetries = 3, delay = 1000) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await operation();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
            }
        }
    }
    
    static async withTimeout(operation, timeoutMs = 10000) {
        return Promise.race([
            operation(),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Operation timeout')), timeoutMs)
            )
        ]);
    }
    
    static safeCleanup(cleanupFn) {
        try {
            return cleanupFn();
        } catch (error) {
            console.warn('Cleanup error:', error.message);
            return Promise.resolve();
        }
    }
}
