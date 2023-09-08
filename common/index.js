import assert from 'assert';

export default class DB {
	/**
	 *
	 * @param {string} [domain] can be ignore for file based db (leveldb)
	 * @param {number|string} [port]
	 * @param {string} [name] another layer of partition, could be a collection, db name
	 * @param {string} [username]
	 * @param {string} [password]
	 * @param {string} [dialect] dialect is mostly the database product name, like `mysql`
	 * @param {string} [driver]
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

	async clear() {

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


	async _connect() {
		return false;
	}

	async disconnect() {

	}

	async query(template, values = {}) {

	}
}