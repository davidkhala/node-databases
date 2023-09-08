import {AbstractGremlin} from './index.js';

export class GremlinServer extends AbstractGremlin {
	constructor({domain = 'localhost', port = 8182} = {}, logger = console.debug) {
		super({domain, port, name: 'gremlin', dialect: 'ws'}, undefined, logger);

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

}

