const createProcessContainer = (type, process, options, init) => {
    return {
        type,
        process,
        options,
        init
    };
};
export { createProcessContainer };
