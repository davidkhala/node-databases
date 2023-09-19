import {GremlinServer} from './gremlin-server.js';
import {Transaction} from '@davidkhala/db/index.js';

export class JanusGraph extends GremlinServer {
	/**
	 *
	 * @returns {GraphTraversalSource}
	 */
	begin() {
		/**
		 * @type {Transaction}
		 */
		this.tx = this.g.tx();
		return this.tx.begin();
	}


}

export class JanusGraphTx extends Transaction {
	/**
	 *
	 * @param {GremlinServer} db
	 */
	constructor(db) {
		super(db);
	}

	/**
	 *
	 * @returns {GraphTraversalSource}
	 */
	begin() {
		/**
		 *
		 * @type {Transaction}
		 */
		this.tx = this.g.tx();
		return this.tx.begin();
	}

	async commit() {

		await this.tx._sessionBasedConnection.commit();
	}

	async rollback(e) {
		this.logger(e);
		await this.tx._sessionBasedConnection.rollback();
	}

	async close() {
		await this.tx.close();
	}
}