import {driver, auth} from 'neo4j-driver'
import DB from '@davidkhala/db'

export class Neo4j extends DB {
    constructor({domain, port = 7687, name, username = 'neo4j', password}) {
        if (!domain && name) {
            domain = `${name}.databases.neo4j.io`
        }
        super(domain, port, name, {username, password})

        this.connection = driver(
            `neo4j+s://${domain}`,
            auth.basic(username, password)
        )
    }

    async connect() {
        await this.connection.verifyAuthentication()
    }

    async disconnect() {
        await this.connection.close()
    }

}