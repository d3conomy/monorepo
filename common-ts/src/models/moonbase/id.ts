import { IdReference, IdReferenceFormat, IIdReference } from "../idReference";
import { MoonbaseComponent } from "./component";
import { PodProcessType } from "./process";

/**
 * Class for an id reference
 * @category IdReference
 */
class MoonbaseId
    extends IdReference
    implements IIdReference
{
    public component: MoonbaseComponent;

    constructor({
        component,
        name,
        format,
        metadata
    }: {
        component?: MoonbaseComponent | PodProcessType | string,
        name?: string,
        format?: IdReferenceFormat | string,
        metadata?: Map<string, any>
    } = {}) {
        super({name, metadata, format});
        this.component = MoonbaseComponent.Moonbase
    }
}

export {
    MoonbaseId
}