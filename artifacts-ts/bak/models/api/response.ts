import { AxiosResponse } from "axios";

import { ResponseCode } from "../log"
import { JobId } from "../moonbase/jobId";


/
class ApiCallResponse {
    public jobId: JobId;
    public code: ResponseCode;
    public data: any;

    constructor({
        jobId,
        output
    } : {
        jobId: JobId,
        output: AxiosResponse,
    }) {
        this.jobId = jobId;
        this.code = output.status;
        this.data = output.data;
    }
}

export {
    ApiCallResponse
}