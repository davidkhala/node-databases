import MongoDB from "./mongo.js";

export class Atlas extends MongoDB {
    /**
     *
     * @param domain
     * @param [username]
     * @param password
     * @param {name}
     */
    constructor({domain, username = 'admin', password, name, port}) {
        super({domain, username, password, name, port, dialect: 'mongodb', driver: 'srv'});
    }

    get connectionString() {
        return super.connectionString + '?retryWrites=true&w=majority'
    }
}