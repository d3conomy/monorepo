
/**
 * Interface for metadata
 * @category Identity
 */
interface IMetaData {
    [key: string]: any;
}

/**
 * Interface for an id reference
 * @category Identity
 */
interface IIdReference {
    name: string;
    metadata: IMetaData;

    toString: () => string;
}

/**
 * Interface for moonbases id reference
 * @category Identity
 */
interface IMoonbasesIdReference 
   extends IIdReference
{
    serverUrl: string;
}

/**
 * Interface for pod bay id reference
 * @category Identity
 */
interface IPodBayIdReference 
   extends IMoonbasesIdReference
{
    podBayId: string;
}

/**
 * Interface for pod id reference
 * @category Identity
 */
interface IPodIdReference 
   extends IPodBayIdReference
{
    podId: string;
}


/**
 * Interface for pod process id reference
 * @category Identity
 */
interface IPodProcessIdReference 
   extends IPodIdReference
{
    podProcessId: string;
}

/**
 * Type for component id references
 * @category Identity
 */
type ComponentIdReferences = IMoonbasesIdReference | IPodBayIdReference | IPodIdReference | IPodProcessIdReference;

/**
 * Interface for job id reference
 * @category Identity
 */
interface IJobIdReference 
   extends IIdReference
{
    componentId: ComponentIdReferences;
}



export {
    IIdReference,
    IMetaData,
    IMoonbasesIdReference,
    IPodBayIdReference,
    IPodIdReference,
    IPodProcessIdReference,
    IJobIdReference,
    ComponentIdReferences
}