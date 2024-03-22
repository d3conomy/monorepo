import { MoonbaseId } from "./id";
import { PodBayId } from "./podBayId";
import { PodId } from "./podId";
import { PodProcessId } from "../../modules/identity-provider/PodProcessId";

type MoonbaseComponentId = MoonbaseId | PodBayId | PodId | PodProcessId;

enum MoonbaseComponentIds {
    MoonbaseId = "moonbaseId",
    PodBayId = "podBayId",
    PodId = "podId",
    PodProcessId = "podProcessId"
}



export {
    MoonbaseComponentId,
    MoonbaseComponentIds,
    isComponentId
}