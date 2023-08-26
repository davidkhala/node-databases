import Gremlin from 'gremlin';
import assert from 'assert';
import DB from '@davidkhala/db/index.js';

const {traversal} = Gremlin.process.AnonymousTraversalSource;

export class AbstractGremlin extends DB {
	constructor({domain, port, dialect, name}, options, logger) {
		super({domain, port, dialect, name}, undefined, logger);
		this.connection = new Gremlin.driver.DriverRemoteConnection(this.connectionString, options);
		/**
         *
         * @type {GraphTraversalSource}
         */
		this.g = traversal().withRemote(this.connection);
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
     * @param [values]
     * @returns {Promise<Array>}
     */
	async query(traversal, values = {}) {
		const message = `g.${traversal}`;
		this.logger(message);
		const resultSet = await this.connection._client.submit(message, values);
		return resultSet.toArray();
	}

	async queryOne(traversal, values) {
		const results = await this.query(traversal, values);
		assert.ok(results.length < 2, results);
		return results[0];

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

	async drop() {
		await AbstractGremlin.query(this.g.V().drop());
	}

	async getV(id) {
		const result = await AbstractGremlin.query(this.g.V(id));
		assert.ok(result.length < 2);
		return result[0];
	}
}