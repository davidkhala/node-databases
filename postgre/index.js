import pg from 'pg';
import DB from '@davidkhala/db/index.js';


const {Client, Pool} = pg;

export default class PG extends DB {
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
		domain, password, name, ssl,
		dialect = 'postgres', port = 5432, username = 'postgres',
	}, connectionString, logger) {
		super({domain, username, password, port, name, dialect}, connectionString, logger);

		const opts = {
			user: username, port, host: domain, password, database: name,
		};
		if (ssl) {
			opts.ssl = {
				require: true,
			};
		}
		this.connection = new Client(opts);
		this._opts = opts;
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

export class PGPool extends PG {
	constructor(...props) {
		super(...props);
		this.connection = new Pool(this._opts);
	}

	async connect() {
		this.pool = await this.connection.connect();
	}

	disconnect() {
		this.pool.release();
		delete this.pool;
	}

	async destroy() {
		await this.connection.end();
	}
}




