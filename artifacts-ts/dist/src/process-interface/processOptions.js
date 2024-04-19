const createProcessOption = ({ name, description, value, required, defaultValue }) => {
    return {
        name,
        description,
        value,
        required,
        defaultValue
    };
};
const findProcessOption = ({ options, name }) => {
    if (options instanceof Array) {
        return options.find((option) => option.name === name);
    }
};
const compileProcessOptions = ({ values, options }) => {
    if (!values) {
        return options.map(option => {
            return {
                ...option,
                value: option.value ? option.value : option.defaultValue
            };
        });
    }
    return options.map((option) => {
        let defaultValue = option.defaultValue ? option.defaultValue : undefined;
        const optionsValue = option.value ? option.value : undefined;
        if (!defaultValue && optionsValue) {
            defaultValue = optionsValue;
        }
        const value = findProcessOption({ options: values, name: option.name });
        if (value !== undefined && value !== null) {
            return {
                ...option,
                value: value.value ? value.value : defaultValue
            };
        }
        return {
            ...option,
            value: defaultValue
        };
    });
};
const formatProcessOptions = (options) => {
    let formattedOptions = new Map();
    for (const option of options) {
        formattedOptions.set(option.name, option);
    }
    return formattedOptions;
};
export { compileProcessOptions, createProcessOption, formatProcessOptions };
