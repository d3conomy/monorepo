
abstract class BaseRecord
    implements
        Record<'name', string>,
        Record<'description', string | undefined>,
        Record<'createdAt', Date>
{
    public readonly name: string
    public readonly description: string | undefined
    public readonly createdAt: Date = new Date()

    constructor({name, description}: {name: string, description?: string}) {
        this.name = name
        this.description = description
    }

    public abstract toString(): string;
    public abstract toJSON(): any;
}


class RecordManager<T extends BaseRecord> {
    private records: Array<T> = new Array<T>()
    private discardedRecords: Array<T> = new Array<T>()

    public addRecord(record: T): void {
        if (this.checkForRecord(record)) {
            throw new Error('Record already exists')
        }
        this.records.push(record)
    }

    public checkForRecord(record: T): boolean {
        return this.records.includes(record)
    }

    public removeRecord(record: T): void {
        if (this.checkForRecord(record)) {
            this.records.splice(this.records.indexOf(record), 1)
            this.discardedRecords.push(record)
        }
    }

    public getRecord(name: string): T | undefined {
        return this.records.find((record) => record.name === name)
    }

    public getRecords(): Array<T> {
        return this.records
    }

    public getDiscardedRecords(): Array<T> {
        return this.discardedRecords
    }

    public getRecordCount(): number {
        return this.records.length
    }

    public getDiscardedRecordCount(): number {
        return this.discardedRecords.length
    }

    public getRecordCountTotal(): number {
        return this.records.length + this.discardedRecords.length
    }

    public static fromArray<T extends BaseRecord>(records: T[]): RecordManager<T> {
        const recordManager = new RecordManager<T>()
        records.forEach((record) => {
            recordManager.addRecord(record)
        })
        return recordManager
    }
}

export {
    BaseRecord,
    RecordManager
}