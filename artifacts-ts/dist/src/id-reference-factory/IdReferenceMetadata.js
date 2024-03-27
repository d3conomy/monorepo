/**
 * MetaData class
 */
class MetaData {
    created;
    updated;
    createdBy;
    updatedBy;
    constructor({ mapped, createdBy } = {}) {
        this.created = new Date();
        this.updated = new Date();
        this.createdBy = createdBy ? createdBy : 'system';
        this.updatedBy = createdBy ? createdBy : 'system';
        if (mapped) {
            for (const [key, value] of mapped) {
                this[key] = value;
            }
        }
    }
    toString() {
        return `Created: ${this.created} by ${this.createdBy}, Updated: ${this.updated} by ${this.updatedBy}`;
    }
    set(key, value) {
        this[key] = value;
        return {
            key,
            value
        };
    }
    get(key) {
        return this[key];
    }
    has(key) {
        return this.hasOwnProperty(key);
    }
    delete(key) {
        delete this[key];
    }
    clear() {
        Object.keys(this).forEach(key => {
            delete this[key];
        });
    }
    update({ key, value, updatedBy }) {
        this[key] = value;
        this.updated = new Date();
        this.updatedBy = updatedBy ? updatedBy : 'system';
        return {
            key,
            value,
            updatedBy: this.updatedBy,
            updated: this.updated
        };
    }
    keys() {
        return Object.keys(this);
    }
    values() {
        return Object.values(this);
    }
    entries() {
        return Object.entries(this);
    }
    forEach(callback) {
        Object.entries(this).forEach(([key, value]) => {
            callback(key, value);
        });
    }
    toJSON() {
        return JSON.stringify(this);
    }
    toMap() {
        return new Map(Object.entries(this));
    }
    fromJSON(data) {
        const parsed = JSON.parse(data);
        Object.keys(parsed).forEach(key => {
            this[key] = parsed[key];
        });
    }
    fromMap(data) {
        data.forEach((value, key) => {
            this[key] = value;
        });
    }
}
export { MetaData };
