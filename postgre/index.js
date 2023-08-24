import pg from 'pg';
import DB from "@davidkhala/db";


const {Client} = pg;

export default class PostGRE extends DB {
    /**
     *
     * @param domain
     * @param [port]
     * @param [connectionString]
     * @param [query_timeout]
     * @param username
     * @param password
     */
    constructor({domain, port = 5432, query_timeout = 2000, username = 'postgres', password}, connectionString) {
        super({domain, username, password, port}, connectionString)
        Object.assign(this, {query_timeout})
    }

    async connect() {
        this.client = new Client(this)
        await this.client.connect()
    }

    async disconnect() {
        await this.client.end()

    }

    async query(sqlTemplate, values) {
        const result = await this.client.query(sqlTemplate, values)
        const {rowCount, rows, fields} = result
        return {rows, fields}
    }
}




