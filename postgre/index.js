import pg from 'pg';
import {SQLAlchemy} from '@davidkhala/sql-alchemy'

const {Client} = pg;

export default class PostGRE extends SQLAlchemy {
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
        super({host: domain, username: user, password, port})
        Object.assign(this, {connectionString, query_timeout})
    }

    async connect() {
        this.client = new Client(this)
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




