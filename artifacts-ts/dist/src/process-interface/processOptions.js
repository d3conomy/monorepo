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
    return new Map(options.map(option => [option.name, option.value]));
};
export { compileProcessOptions, createProcessOption, formatProcessOptions };
