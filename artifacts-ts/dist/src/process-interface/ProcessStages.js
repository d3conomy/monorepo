/**
 * Lunar Pod Process Stages
 * @category Process
 */
var ProcessStage;
(function (ProcessStage) {
    ProcessStage["NEW"] = "new";
    ProcessStage["INITIALIZING"] = "initializing";
    ProcessStage["INITIALIZED"] = "initialized";
    ProcessStage["STARTED"] = "started";
    ProcessStage["STARTING"] = "starting";
    ProcessStage["PENDING"] = "pending";
    ProcessStage["COMPLETED"] = "completed";
    ProcessStage["STOPPING"] = "stopping";
    ProcessStage["STOPPED"] = "stopped";
    ProcessStage["RESTARTING"] = "restarting";
    ProcessStage["ERROR"] = "error";
    ProcessStage["WARNING"] = "warning";
    ProcessStage["UNKNOWN"] = "unknown";
})(ProcessStage || (ProcessStage = {}));
/**
 * Check if a string is a valid process stage
 * @category Process
 */
const isProcessStage = (stage) => {
    if (Object.values(ProcessStage).includes(stage)) {
        return stage;
    }
    else if (stage === undefined) {
        return ProcessStage.UNKNOWN;
    }
    throw new Error('Invalid process stage');
};
export { ProcessStage, isProcessStage };
