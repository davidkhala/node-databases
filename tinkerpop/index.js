import Gremlin from 'gremlin';
import assert from 'assert';
import DB from '@davidkhala/db/index.js';
import {Element} from './query.js';


export class AbstractGremlin extends DB {
	constructor({domain, port, dialect, name}, options, logger) {
		super({domain, port, dialect, name}, undefined, logger);
		this.connection = new Gremlin.driver.DriverRemoteConnection(this.connectionString, options);
	}

	async connect(waitUntil) {

		const _connect = async (retryCount) => {
			retryCount++;
			try {
				await this.connection._client.open();
				return retryCount;
			} catch (e) {
				return await _connect(retryCount);
			}

		};
		if (waitUntil) {
			return _connect(0);
		} else {
			await this.connection._client.open();
		}
	}

	async disconnect() {
		await this.connection._client.close();
	}

	/**
	 *
	 * @param {string} traversal
	 * @param {Object} [values]
	 * @returns {Promise<Array>}
	 */
	async query(traversal, values = {}) {
		const message = `g.${traversal}`;
		this.logger(message);
		const resultSet = await this.connection._client.submit(message, values);
		return resultSet.toArray();
	}

	/**
	 *
	 * @param {string} traversal
	 * @param [values]
	 */
	async queryOne(traversal, values) {
		const results = await this.query(traversal, values);
		assert.ok(results.length < 2, results);
		return results[0];

	}

	/**
	 * @param {string} traversal
	 */
	async getId(traversal) {
		const result = await this.queryOne(traversal);
		if (result) {
			return result.id;
		}
	}

	/**
	 *
	 * @param {Element} e
	 * @param {[]} [createParams]
	 * @param {[]} [whereParams]
	 * @returns {Promise<string|number>}
	 */
	async createIfNotExist(e, createParams = [], whereParams) {
		if (whereParams) {
			const id = await this.getId(e.where(...whereParams));
			if (id) {
				return id;
			}
		}
		const {id} = await this.queryOne(e.create(...createParams));
		return id;
	}

	/**
	 *
	 * @param {GraphTraversal} traversal
	 * @returns {Promise<Array>}
	 */
	static async query(traversal) {
		return await traversal.toList();
	}

	static async queryOne(traversal) {
		const results = await AbstractGremlin.query(traversal);
		assert.ok(results.length < 2, results);
		return results[0];
	}

	/**
	 * @abstract
	 */
	async drop() {

	}

}