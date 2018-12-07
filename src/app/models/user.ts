export class User {
    username: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
