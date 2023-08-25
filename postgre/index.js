import pg from 'pg';
import DB from "@davidkhala/db/index.js";
import assert from "assert";


const {Client} = pg;

export default class PostGRE extends DB {
    /**
     *
     * @param domain
     * @param [port]
     * @param [connectionString]
     * @param [query_timeout]
     * @param [username]
     * @param [password]
     */
    constructor({
                    domain, port = 5432, username = 'postgres', password, name
                }, connectionString) {
        super({domain, username, password, port, name, dialect: 'postgresql'}, connectionString)

        this.connection = new Client({
            user: username, port, host: domain, password, database: name,
        })
    }

    async connect() {
        await this.connection.connect()
    }

    async disconnect() {
        await this.connection.end()
    }

    async query(sqlTemplate, values) {
        const result = await this.client.query(sqlTemplate, values)
        const {rowCount, rows, fields} = result
        return {rows, fields}
    }
}




