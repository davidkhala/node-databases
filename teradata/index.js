import {TeradataConnection} from 'teradata-nodejs-driver';
import DB from '@davidkhala/db/index.js'

export default class Teradata extends DB {

    constructor({host, port = 1025, username = 'dbc', password = 'dbc', client, cursor}) {
        super({domain: host, port, username, password})
        this.connection = client || new TeradataConnection();
        this.cursor = cursor
    }

    connect() {
        const {username: user, host, password} = this
        this.connection.connect({host, user, password})
        this.cursor = this.connection.cursor();
    }

    execute(sql) {
        this.cursor.execute(sql);
    }

    query(sql, withHeader) {
        this.execute(sql)
        const rows = this.cursor.fetchall()
        if (withHeader) {
            rows.unshift(this.cursor.description.map(desc => desc[0]))
            return rows
        }
    }


    disconnect() {
        // this.cursor.close(); // FIXME: Error: 0 is not a valid rows handle
        this.connection.close();
    }
}

export class SystemInfo extends Teradata {
    session() {
        this.execute('help session');
        const row = this.cursor.fetchone()

        let result = {}
        row.forEach((field, index) => {
            result[this.cursor.description[index][0]] = field
        });
        return result
    }

    version() {
        this.execute('{fn teradata_nativesql}{fn teradata_database_version}');
        const rows = this.cursor.fetchone();
        return rows[0]
    }

}
