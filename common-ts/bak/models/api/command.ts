import { IdReference } from "../idReference"
import { ComponentIds, MoonbaseId, PodBayId, PodId, PodProcessId } from "../moonbase";
import { MoonbaseCommandAction } from "../moonbase/commandActions";
import { JobId } from "../moonbase/jobId";



class ApiCommand {
    id: IdReference;
    action: MoonbaseCommandAction;
    args: Map<string, string>;
    endpoint?: string;
    result?: Response;

    constructor({
        id,
        action,
        args,
        endpoint

    } : {
        id?: IdReference,
        action: MoonbaseCommandAction,
        args?: Map<string, string>,
        endpoint?: string
    }) {
        this.id = id ? id : new IdReference();
        this.endpoint = endpoint;
        this.action = action;
        this.args = args ? args : new Map<string, string>();
    }
}

class MoonbaseApiCommand extends ApiCommand {
    public jobId: JobId;

    constructor({
        id,
        action,
        args,
        jobId,
        podProcessId,
        podId,
        podBayId,
        moonbaseId
    } : {
        id: IdReference,
        action: MoonbaseCommandAction,
        args?: Map<string, string>
        jobId?: JobId,
        podProcessId?: PodProcessId,
        podId?: PodId,
        podBayId?: PodBayId,
        moonbaseId?: MoonbaseId
    }) {
        super({id, action, args});
        this.jobId = jobId ? jobId : new JobId();
        this.podBayId = podBayId;
        this.podId = podId;
        this.podProcessId = podProcessId;
        this.moonbaseId = moonbaseId;
    }
}

export {
    ApiCommand,
    MoonbaseApiCommand
}