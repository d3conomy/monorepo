

/**
 * Function to check if a string is a moonbase command action
 * @category Moonbase
 * @param command - The string to check
 * @returns The moonbase command action
 */
const isMoonbaseCommandAction = (command?: string): MoonbaseCommandAction => {
    if (!command) { 
        return MoonbaseCommandAction.Ping;
    }
    
    if(Object.values(MoonbaseCommandAction).includes(command as MoonbaseCommandAction)) {
        return command as MoonbaseCommandAction;
    }
    else {
        throw new Error(`Invalid moonbase command action: ${command}`);
    }
}


export {
    MoonbaseCommandAction,
    isMoonbaseCommandAction
}