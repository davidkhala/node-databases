import pg from 'pg';
import DB from '@davidkhala/db/index.js';


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
	 * @param [logger]
	 */
	constructor({
		domain, port = 5432, username = 'postgres', password, name
	}, connectionString, logger) {
		const dialect = 'postgres'; // both 'postgresql' or 'postgres' are OK
		super({domain, username, password, port, name, dialect}, connectionString, logger);

		this.connection = new Client({
			user: username, port, host: domain, password, database: name,
		});
	}

	async connect() {
		await this.connection.connect();
	}

	async disconnect() {
		await this.connection.end();
	}

	async query(sqlTemplate, values) {
		const result = await this.connection.query(sqlTemplate, values);
		const {rowCount, rows, fields} = result;
		return {rows, fields, rowCount};
	}
}




