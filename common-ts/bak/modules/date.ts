class DateReference {
    public readonly date: Date;

    constructor(date?: Date) {
        this.date = date ? date : new Date();
    }
    
    toString() {
        return this.date.toISOString();
    }
}

export {
    DateReference
}