import {TeradataConnection} from 'teradata-nodejs-driver';

export default class Teradata {

    constructor({host, username = 'dbc', password = 'dbc'}) {
        this.client = new TeradataConnection();
        this.connect({
            host,
            user: username,
            password,
        })
    }

    connect(opts) {
        this.client.connect(opts)
        this.cursor = this.client.cursor();
    }

    version() {

        this.cursor.execute('{fn teradata_nativesql}Database version{fn teradata_database_version}');
        const rows = this.cursor.fetchone();
        return rows[0]
    }

    disconnect() {
        this.cursor.close();
        this.client.close();
    }
}
