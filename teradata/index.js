import {TeradataConnection} from 'teradata-nodejs-driver';
import {SQLAlchemy} from '@davidkhala/sql-alchemy'

export default class Teradata extends SQLAlchemy {

    constructor({host, port = 1025, username = 'dbc', password = 'dbc', client, cursor}) {
        super({host, port, username, password})
        this.client = client || new TeradataConnection();
        this.cursor = cursor
    }

    connect() {
        const {username: user, host, password} = this
        this.client.connect({host, user, password})
        this.cursor = this.client.cursor();
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
        this.client.close();
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
