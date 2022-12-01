export class SQLAlchemy {
    constructor({host, port, username, password}, logger = console) {
        Object.assign(this, {host, port, username, password, logger})
    }

    uri() {
        let uri = this._dialect ? `${this._dialect}+` : '';

        uri += `${this._driver}://${this.username}:${this.password}@${this.host}:${this.port}`
        if (this.database) {
            uri += `/${this.database}`
        }
        return uri
    }
}
