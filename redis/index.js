import {createClient} from 'redis';
import DB, {Transaction} from '@davidkhala/db/index.js';

export default class Client extends DB {

	constructor({
		domain, username = '', password = '',
		dialect = 'redis', port = 6379
	}) {
		super({domain, port, username, password, dialect});

		this.connection = createClient({
			url: this.connectionString
		});
	}

	async hSet(table, key, value) {
		await this.connection.hSet(table, key, value);
	}

	async hGet(table, key) {
		return await this.connection.hGet(table, key);
	}

	async hGetAll(table) {
		return await this.connection.hGetAll(table);
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

export class RedisTx extends Transaction {

	constructor(db) {
		super(db);
	}

	begin() {
		this.tx = this.connection.multi();
		return this.tx;
	}

	close() {
		this.tx.discard();
		delete this.tx;
	}

	async commit() {
		return await this.tx.exec();
	}

	/**
	 * https://redis.io/docs/interact/transactions/#what-about-rollbacks
	 */
	async rollback(e) {
		// Errors happening after EXEC instead are not handled in a special way
		// all the other commands will be executed even if some command fails during the transaction.
		throw Error('Redis does not support rollbacks of transactions');
	}
}