import * as Libp2pCommands from "./libp2p";
import * as IpfsCommands from "./ipfs";
import * as OrbitDbCommands from "./orbitDb";
import * as ServerCommands from "./moonbaseServer";
import { ApiCallResponse } from "../../models/api/response";
import { AxiosResponse } from "axios";
import { MoonbaseId, PodId, PodProcessId } from "../../models";
import { JobId } from "../../models/moonbase/jobId";


const callMoonbaseApi = async ({
    command,
    args,
    jobId
} : {
    command: string,
    args?: Map<string, any>,
    jobId?: JobId
}): Promise<ApiCallResponse> => {

    let result: AxiosResponse<any> | undefined = undefined;

    try {
        switch (command) {
            case "ping":
                result = await ServerCommands.ping(serrverUrl);
                break;
            default:
                throw new Error("Invalid command");
            }
    }
    catch (error: any) {
        return {
            code: 500,
            data: {
                message: error.message
            }
        }
    }
    return {
        code: result?.status,
        data: result?.data
    }
}









