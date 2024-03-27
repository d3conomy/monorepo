import { MoonbaseIdComponents } from '../../constants';
import { ComponentIdReferences, IJobIdReference } from '../../interfaces/IdReference';
import { IdReference } from './IdReference';


/**
 * Class for a job id
 * @category Job
 */
class JobId extends IdReference implements IJobIdReference {
    public componentId: ComponentIdReferences;

    constructor({
        name,
        format,
        metadata,
        componentId,
    }: {
        name?: string,
        format?: string,
        metadata?: Map<string, any>,
        componentId: MoonbaseIdComponents | string
    }) {
        super({
            name,
            metadata,
            format
        });

        this.componentId = componentId;
    }

    public static isMoonbaseIdComponent = (
        component: MoonbaseIdComponents | string
    ): boolean => {
        return Object.values(MoonbaseIdComponents).includes(component as MoonbaseIdComponents);
    }
}

export {
    JobId
}