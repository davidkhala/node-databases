export default class DB {
    /**
     *
     * @param [name] another layer of partition, could be a collection, db name
     */
    constructor({domain, port, name, username, password, dialect, driver}, connectionString, logger) {
        if (connectionString) {
            this.connectionString = connectionString
        } else {
            Object.assign(this, {domain, port, name, username, password, dialect, driver})
        }
        Object.assign(this, {logger})

        this.connection = undefined
    }

    set connectionString(_) {
        this._connectionString = _
    }

    get connectionString() {
        if (this._connectionString) {
            return this._connectionString
        }
        const {dialect, driver, username: u, password: p, domain, port: P, name: n} = this
        return `${dialect}${driver ? '+' + driver : ''}://${u}${p ? ':' + p : ''}@${domain}${P ? ':' + P : ''}${n ? '/' + n : ''}`;
    }

    get dialect() {
        if (this._dialect) {
            return this._dialect
        }
        return this.constructor.name.toLowerCase()
    }

    set dialect(_) {
        this._dialect = _
    }

    async clear() {

    }

    async connect() {

    }

    async disconnect() {

    }

    async query(template, values = {}) {

    }
}