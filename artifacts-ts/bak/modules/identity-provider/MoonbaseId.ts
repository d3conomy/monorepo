
import { IdReference } from './IdReference';

/**
 * Class for an id reference
 * @category IdReference
 */
class MoonbaseId
    extends IdReference
    implements IIdReference
{
    public serverUrl: ServerConfig['base_url'];

    constructor({
        serverUrl,
        name,
        format,
        metadata
    }: {
        serverUrl: ServerConfig['base_url'],
        name?: string,
        format?: IdReferenceFormat | string,
        metadata?: Map<string, any>
    }) {
        super({name, metadata, format});
        this.serverUrl = serverUrl;
    }
}

export {
    MoonbaseId
}