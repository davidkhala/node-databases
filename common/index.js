import assert from 'assert';

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

export default class DB {
	/**
	 *
	 * @param {ConnectionOpts} options
	 * @param {string} [connectionString]
	 * @param {function} [logger]
	 */
	constructor({domain, port, name, username, password, dialect, driver}, connectionString, logger) {
		if (connectionString) {
			this.connectionString = connectionString;
		} else {
			username || assert.ok(!password, 'username should exist given password exist');
			Object.assign(this, {domain, port, name, username, password, dialect, driver});
		}
		Object.assign(this, {logger});

		this.connection = undefined;
	}

	set connectionString(_) {
		this._connectionString = _;
	}

	get connectionString() {
		if (this._connectionString) {
			return this._connectionString;
		}
		const {dialect, driver, username: u, password: p, domain, port: P, name: n} = this;
		const auth = `${u || ''}${p ? ':' + p : ''}${u ? '@' : ''}`;

		return `${dialect}${driver ? '+' + driver : ''}://${auth}${domain}${P ? ':' + P : ''}${n ? '/' + n : ''}`;
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

	async connect(maxRetry) {
		const _connect = async (retryCount, _maxRetry) => {
			try {
				await this._connect();
				return retryCount;
			} catch (e) {
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
	 * @abstract
	 * @private
	 */
	async _connect() {
		return false;
	}

	/**
	 * @abstract
	 * @returns {Promise<void>}
	 */
	async disconnect() {
	}

	/**
	 * @abstract
	 * @param {string} template
	 * @param {Object} [values]
	 * @param {Object} [requestOptions]
	 */
	async query(template, values = {}, requestOptions = {}) {

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
		this.connection = db.connection;
	}

	/**
	 * Truncate data
	 * @abstract
	 * @returns {Promise<void>}
	 */
	async clear() {

	}

}