interface IMetaData {
    [key: string]: any;
}

class MetaData implements IMetaData {
    [key: string]: any;
    constructor(data?: IMetaData) {
        Object.assign(this, data);
    }
}

export {
    IMetaData,
    MetaData
}