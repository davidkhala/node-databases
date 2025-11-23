import assert from 'assert';
import {build} from './connection-string.js';

/**
 * @typedef {Object} ConnectionOpts
 * @property {string} [domain] can be ignore for file based db (e.g. leveldb)
 * @property {number|string} [port]
 * @property {string} [name] another layer of partition, could be a collection, db name
 * @property {string} [username]
 * @property {string} [password]
 * @property {string} [dialect] dialect is mostly the database product name (e.g.`mysql`)
 * @property {string} [driver]
 */

export class Connectable {
	/**
	 * @param {Error} e
	 * @return {Promise<boolean>|boolean} By default (as `false`), connect error will be ignored. A promise as return is also acceptable
	 * @private
	 */
	_throwConnectError(e) {
		return false;
	}

	async connect(maxRetry) {
		const _connect = async (retryCount, _maxRetry) => {
			try {
				await this._connect();
				return retryCount;
			} catch (e) {
				if (await this._throwConnectError(e)) {
					throw e;
				}

				if (retryCount === _maxRetry) {
					throw Error(`retryCount=${retryCount} meet maxRetry=${_maxRetry}`);
				}
				retryCount++;

				return await _connect(retryCount, _maxRetry);
			}


		};
		if (!maxRetry) {
			await this._connect();
		} else {
			assert.ok(Number.isInteger(maxRetry), `maxRetry should be a number, but got ${maxRetry}`);
			return _connect(0, maxRetry);

		}
	}

	/**
	 * @private
	 */
	async _connect() {
		return false;
	}

	/**
	 * @abstract
	 */
	async disconnect() {
	}
}

/**
 * @abstract
 */
export default class DB extends Connectable {
	/**
	 *
	 * @param {ConnectionOpts} [options]
	 * @param {string} [connectionString]
	 * @param {Console|Object} [logger]
	 */
	constructor({domain, port, name, username, password, dialect, driver} = {}, connectionString, logger) {
		super();
		if (connectionString) {
			this.connectionString = connectionString;
		} else {
			username || assert.ok(!password, 'username should exist given password exist');
			Object.assign(this, {domain, port, name, username, password, dialect, driver});
		}
		this.logger = logger;
		this.connection = undefined;
	}

	set connectionString(_) {
		this._connectionString = _;
	}

	get connectionString() {
		if (this._connectionString) {
			return this._connectionString;
		}
		return build(this, this.options);

	}

	get dialect() {
		if (this._dialect) {
			return this._dialect;
		}
		return this.constructor.name.toLowerCase();
	}

	set dialect(_) {
		this._dialect = _;
	}


	/**
	 * rebuild this.connection in implementation
	 */
	reset() {
		delete this.connection;
	}

	/**
	 * @param {string} template
	 * @param {Object} [values]
	 * @param {Object} [requestOptions]
	 */
	async query(template, values = {}, requestOptions = {}) {

	}

	/**
	 * @abstract
	 * @returns {DBA}
	 */
	get dba() {
		return new DBA(this);
	}
}

/**
 * Database Admin
 */
export class DBA {
	/**
	 *
	 * @param {DB} db DB instance
	 */
	constructor(db) {
		this.db = db;
	}

	get logger() {
		return this.db.logger;
	}

	get connection() {
		return this.db.connection;
	}

	get connectionString() {
		return this.db.connectionString;
	}

	/**
	 * Truncate data
	 * @abstract
	 * @returns {Promise<void>}
	 */
	async clear() {

	}

}

export class Transaction {
	/**
	 *
	 * @param {DB} db DB instance
	 */
	constructor(db) {
		Object.assign(this, db);
	}

	/**
	 * @abstract
	 * @return {Transaction}
	 */
	begin() {
		return this;
	}

	/**
	 * @abstract
	 * @return {Promise<void>}
	 * @private
	 */
	async commit() {

	}

	/**
	 * @abstract
	 * @param {Error} e
	 * @return {Promise<void>}
	 * @private
	 */
	async rollback(e) {

	}

	/**
	 * @abstract
	 * @return {Promise<void>}
	 * @private
	 */
	async close() {

	}

	async submit() {
		try {
			await this.commit();
		} catch (e) {
			await this.rollback(e);
			throw e;
		} finally {
			await this.close();
		}
	}
}