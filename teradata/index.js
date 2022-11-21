import {TeradataConnection} from 'teradata-nodejs-driver';

export default class Teradata {

    constructor({host, username = 'dbc', password = 'dbc'}) {
        this.client = new TeradataConnection();
        Object.assign(this, {host, username, password})
    }

    connect() {
        const {username: user, host, password} = this
        this.client.connect({host, user, password})
        this.cursor = this.client.cursor();
    }

    execute(sql) {
        this.cursor.execute(sql);
    }

    query(sql) {
        this.execute(sql)
        return this.cursor.fetchall()
    }


    disconnect() {
        this.cursor.close();
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
        this.execute('{fn teradata_nativesql}Database version{fn teradata_database_version}');
        const rows = this.cursor.fetchone();
        return rows[0]
    }

    static buildFrom(teradata) {
        return new SystemInfo(teradata)
    }
}
