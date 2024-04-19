const createProcessOption = ({ name, description, value, required, defaultValue }) => {
    return {
        name,
        description,
        value,
        required,
        defaultValue
    };
};
const compileProcessOptions = ({ values, options }) => {
    return options.map(option => {
        const value = values.find(value => value.name === option.name);
        if (!value) {
            return {
                ...option,
                value: option.value ? option.value : option.defaultValue
            };
        }
        return {
            ...option,
            value: value?.value ?? option.defaultValue
        };
    });
};
const formatProcessOptions = (options) => {
    return options.reduce((acc, option) => {
        acc[option.name] = option.value;
        return acc;
    }, {});
};
export { compileProcessOptions, createProcessOption, formatProcessOptions };
