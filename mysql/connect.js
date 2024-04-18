import mysql from 'mysql2/promise';
import DB from '@davidkhala/db/index.js'

export default class MySQL extends DB {
    constructor({domain, username, password}) {
        super({domain, username, password});

    }

    async connect() {
        const {username: user, domain: host, name: database, password} = this
        this.connection = await mysql.createConnection({
            user, host, database, password
        })
    }

    async query(template, values = []) {
        const [results, fields] = await this.connection.query(template, values);
        return [results, fields]
    }
    async disconnect(force){
        await this.connection.end()
        if(force){
            this.connection.destroy()
        }
    }
}

