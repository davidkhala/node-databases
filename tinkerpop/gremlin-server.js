import {AbstractGremlin} from './index.js';

export class GremlinServer extends AbstractGremlin {
	constructor({domain = 'localhost', port = 8182} = {}, logger = console.debug) {
		super({domain, port, name: 'gremlin', dialect: 'ws'}, undefined, logger);

	}


	/**
     * @param {GraphTraversal|string} traversal
     */
	async queryOne(traversal) {
		let result;
		if (typeof traversal === 'string') {
			result = await super.queryOne(traversal);
		} else {
			result = await GremlinServer.queryOne(traversal);
		}
		return result;
	}

}

