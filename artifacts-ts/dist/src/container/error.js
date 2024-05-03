class ContainerError extends Error {
    containerId;
    constructor(message, containerId) {
        super(message);
        this.containerId = containerId;
        this.name = 'ContainerError';
    }
}
export { ContainerError };
