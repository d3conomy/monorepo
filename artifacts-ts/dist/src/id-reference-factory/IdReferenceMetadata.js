/**
 * MetaData class
 */
class MetaData {
    data;
    constructor(data) {
        this.data = data ? data : new Map();
    }
    set(key, value) {
        this.data.set(key, value);
    }
    get(key) {
        return this.data.get(key);
    }
    delete(key) {
        this.data.delete(key);
    }
    has(key) {
        return this.data.has(key);
    }
    update(key, value) {
        if (this.has(key)) {
            this.set(key, value);
        }
        else {
            throw new Error(`MetaData: Key ${key} does not exist`);
        }
    }
    clear() {
        this.data.clear();
    }
}
export { MetaData };
