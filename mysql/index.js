import mysql from 'mysql2/promise';
import DB from '@davidkhala/db/index.js';

export default class MySQL extends DB {
	constructor({domain, username, password, name, port}, connectionString, logger) {
		super({domain, username, password, name, port}, connectionString, logger);
	}

	async connect() {
		const {username: user, domain: host, name: database, password, port} = this;
		const opts = host ? {
			user, host, database, password, port,
			ssl: this.ssl
		} : this.connectionString;

		this.connection = await mysql.createConnection(opts);
	}

	async query(template, values = []) {
		const [results, fields] = await this.connection.query(template, values);
		return [results, fields];
	}

	async disconnect(force) {
		await this.connection.end();
		if (force) {
			this.connection.destroy();
		}
	}
}

