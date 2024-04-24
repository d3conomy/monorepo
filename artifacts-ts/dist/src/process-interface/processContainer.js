class ProcessContainer {
    type;
    process;
    options;
    init;
    constructor({ type, process, options, init }) {
        this.type = type;
        this.process = process;
        this.options = options;
        this.init = init;
    }
    loadProcess(process) {
        this.process = process;
    }
}
const createProcessContainer = ({ type, process, options, init }) => {
    return new ProcessContainer({
        type,
        process,
        options,
        init
    });
};
export { createProcessContainer };
