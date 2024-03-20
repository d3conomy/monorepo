import { IIdReference, IdReference, IdReferenceFormat } from '../idReference';
import { MoonbaseId } from './id';
import { PodProcessType, isPodProcessType } from './process';


/**
 * Class for an id reference
 * @category Logging
 */
class PodProcessId
    extends MoonbaseId
    implements IIdReference
{
    constructor({
        name,
        format,
        metadata,
        component
    }: {
        component?: PodProcessType,
        name?: string,
        format?: IdReferenceFormat;
        metadata?: Map<string, any>
    } = {}) {
        component = isPodProcessType(component);
        super({name, metadata, format, component});
    }
}

export {
    PodProcessId
}
