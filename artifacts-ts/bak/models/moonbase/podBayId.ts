import { IIdReference, IdReference } from "../idReference";
import { MoonbaseId } from "./id";

/**
 * Pod bay id
 * @category PodBay
 */
class PodBayId
    extends IdReference
    implements IIdReference
{
    public moonbaseId: MoonbaseId;

    constructor({
        moonbaseId,
        name,
        format,
        metadata
    }: {
        moonbaseId: MoonbaseId
        name?: string,
        format?: string,
        metadata?: Map<string, any>
    }) {
        super({name, format, metadata});
        this.moonbaseId = moonbaseId;
    }
}

export {
    PodBayId
}