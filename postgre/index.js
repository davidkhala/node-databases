import pg from 'pg';

const {Client} = pg;

export default class PostGRE {
    constructor({domain, port = 5432, connectionString, query_timeout = 2000}, user, password, client) {
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
        this.client = new Client(opt)

    }

    async connect() {
        await this.client.connect()
    }

    async disconnect() {
        await this.client.end()
    }

    async query(config, values) {
        const result = await this.client.query(config, values)
        const {rowCount, rows, fields} = result
        return {rows, fields}
    }
}




