import {GremlinServer} from './gremlin-server.js';

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

	async commit() {
		const {tx} = this;
		try {
			await tx._sessionBasedConnection.commit();
		} catch (e) {
			this.logger(e);
			await tx._sessionBasedConnection.rollback();
		} finally {
			await tx.close();
			delete this.tx;
		}
	}
}