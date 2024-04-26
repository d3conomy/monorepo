class ProcessContainer {
    type;
    instance;
    options;
    init;
    constructor({ type, instance, options, init }) {
        this.type = type;
        this.instance = instance;
        this.options = options;
        this.init = init;
    }
    loadInstance(instance) {
        this.instance = instance;
    }
}
const createProcessContainer = ({ type, instance, options, init }) => {
    return new ProcessContainer({
        type,
        instance,
        options,
        init
    });
};
export { createProcessContainer };
