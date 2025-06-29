import { v4 as uuidv4 } from 'uuid'

import { BaseRecord, RecordManager } from './records.js'

enum IdentityReferenceFormat {
    UUID = 'uuid',
    Custom = 'custom'
}

type IdentityReferenceType = Record<'format', IdentityReferenceFormat> & Record<'generator', () => any> & Record<'verifier', (id: string) => boolean>

const IdentityReferenceTypeUUID: IdentityReferenceType = {
    format: IdentityReferenceFormat.UUID,
    generator: () => { return uuidv4() },
    verifier: (id: string): boolean => {
        return id.length === 36
    }
}

const IdentityReferenceTypeCustom: IdentityReferenceType = {
    format: IdentityReferenceFormat.Custom,
    generator: () => { return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) },
    verifier: (id: string): boolean => {
        return id.length <= 255
    }
}

const IdentityReferenceTypes: Record<IdentityReferenceFormat, IdentityReferenceType> = {
    [IdentityReferenceFormat.UUID]: IdentityReferenceTypeUUID,
    [IdentityReferenceFormat.Custom]: IdentityReferenceTypeCustom
}

class IdentityRecord
    extends BaseRecord
    implements 
        Record<'id', string>,
        Record<'type', IdentityReferenceType>,
        Record<'parent', IdentityRecord | undefined>
{
    public readonly id: string
    public readonly type: IdentityReferenceType
    public readonly parent: IdentityRecord | undefined

    constructor({
        id,
        type,
        name,
        description,
        parent
    } : {
        id?: string,
        type?: IdentityReferenceType | undefined,
        name?: string,
        description?: string,
        parent?: IdentityRecord | undefined
    } = {}) {
        super({
            name: name !== undefined ? name : 'identity',
            description: description
        })
        const inputType = type ? type : IdentityReferenceTypeUUID
        const inputId = id ? id : IdentityRecord.createId(inputType.format)

        IdentityRecord.validate(inputId, inputType)

        this.id = inputId
        this.type = inputType
        this.parent = parent
    }

    private static validateId(id: string, type: IdentityReferenceType) {
        if (!type.verifier(id)) {
            throw new Error('Invalid id')
        }
    }

    private static validateType(type: IdentityReferenceType) {
        if (!IdentityReferenceTypes[type.format]) {
            throw new Error('Invalid type')
        }
    }

    private static validate(id: string, type: IdentityReferenceType) {
        this.validateId(id, type)
        this.validateType(type)
    }

    private static createId(format: IdentityReferenceFormat): string {
        return IdentityReferenceTypes[format].generator()
    }

    public toString({details}: {details?: boolean} = {}): string {
        if (details !== undefined && details === true) {
            return JSON.stringify(this.toJSON())
        }
        else {
            return this.id
        }
    }

    public toJSON(): Record<string, any> {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            description: this.description,
            createdAt: this.createdAt,
            parent: this.parent
        }
    }
}

class IdentityManager 
    extends RecordManager<IdentityRecord>
{
    public createIdentity({
        id,
        type,
        parent
    }: {
        id?: string,
        type?: IdentityReferenceType,
        parent?: IdentityRecord | undefined
    } = {}): IdentityRecord {
        const record = new IdentityRecord({ id, type, parent })
        this.addRecord(record)
        return record
    }

    public findIdentity(id: string): IdentityRecord | undefined {
        return this.getRecords().find((record) => record.id === id)                                                                                                                                                                                                                                                                                                                                                                                                                       
    }

    public findIdentityByParent(parent: IdentityRecord): Array<IdentityRecord> {
        return this.getRecords().filter((record) => record.parent === parent)
    }

    public findIdentityByType(type: IdentityReferenceType): Array<IdentityRecord> {
        return this.getRecords().filter((record) => record.type === type)
    }

    private buildIdentityTree(identity: IdentityRecord): Record<string, any> {
        return {
            identity: identity,
            children: this.findIdentityByParent(identity).map((child) => this.buildIdentityTree(child))
        }
    }

    public getIdentityTree(): Record<string, any> {
        return this.getRecords().filter((record) => record.parent === undefined).map((record) => this.buildIdentityTree(record))
    }
}


export {
    IdentityRecord,
    IdentityReferenceFormat,
    IdentityReferenceType,
    IdentityReferenceTypeUUID,
    IdentityReferenceTypeCustom,
    IdentityReferenceTypes,
    IdentityManager
}
