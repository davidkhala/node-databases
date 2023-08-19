export default class DB {
    /**
     *
     * @param domain
     * @param port
     * @param [name]
     */
    constructor(domain, port, name, {username, password} = {},) {
        Object.assign(this, {domain, port, name, username, password})
        this.connection = undefined
    }


    async clear() {

    }

    async connect() {

    }

    async disconnect() {

    }
}