import {AbstractGremlin, AbstractGremlinAdmin} from './index.js';
import assert from 'assert';
import Gremlin from 'gremlin';

const {AnonymousTraversalSource} = Gremlin.process;

export class GremlinServer extends AbstractGremlin {
	constructor({domain = 'localhost', port = 8182} = {}, logger = console.debug) {
		super({domain, port, name: 'gremlin', dialect: 'ws'}, undefined, logger);
		/**
		 *
		 * @type {GraphTraversalSource}
		 */
		this.g = AnonymousTraversalSource.traversal().withRemote(this.connection);
	}


	/**
	 * @param {GraphTraversal|string} traversal
	 * @param [values] applicable when traversal is string
	 */
	async queryOne(traversal, values) {
		let result;
		if (typeof traversal === 'string') {
			result = await super.queryOne(traversal, values);
		} else {
			result = await GremlinServer.queryOne(traversal);
		}
		return result;
	}

	async getV(id) {
		const result = await AbstractGremlin.query(this.g.V(id));
		assert.ok(result.length < 2);
		return result[0];
	}

}

export class GremlinServerAdmin extends AbstractGremlinAdmin {

	get g() {
		return this.db.g;
	}

	async clear() {
		await AbstractGremlin.query(this.g.V().drop());
	}
}

