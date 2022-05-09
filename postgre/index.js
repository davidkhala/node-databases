import pg from 'pg';

const {Client} = pg;

export default class PostGRE {
    /**
     *
     * @param domain
     * @param [port]
     * @param [connectionString]
     * @param [query_timeout]
     * @param user
     * @param password
     */
    constructor({domain, port = 5432, connectionString, query_timeout = 2000}, user, password) {
        const opt = {
            connectionString,
            query_timeout,
        }
        if (!connectionString) {
            Object.assign(opt, {
                user, password, port,
                host: domain,
            })
        }
        this.opt = opt
    }

    async connect() {
        this.client = new Client(this.opt)
        await this.client.connect()
    }

    async disconnect() {
        await this.client.end()
        //Error: Client has already been connected. You cannot reuse a client.
        delete this.client
    }

    async query(config, values) {
        const result = await this.client.query(config, values)
        const {rowCount, rows, fields} = result
        return {rows, fields}
    }
}




