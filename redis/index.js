import {createClient} from 'redis';
import DB from '@davidkhala/db/index.js';

export default class Client extends DB {

	constructor({domain, port, username = '', password = ''}) {
		super({domain, port, username, password});

		this.dialect = 'redis';
		const url = this.connectionString;
		this.connection = createClient({
			url
		});
	}

	async get(key) {
		return await this.connection.get(key);
	}

	async set(key, value) {
		await this.connection.set(key, value);
	}

	async clear() {
		await this.connection.flushDb();
	}


	async connect() {
		await this.connection.connect();
	}

	async disconnect() {
		await this.connection.disconnect();
	}
}
