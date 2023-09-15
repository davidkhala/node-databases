import {Neo4j} from './index.js';

export class LocalhostNeo4j extends Neo4j {
	constructor({password = 'neo4j'} = {}, logger) {
		super({domain: 'localhost', password, dialect: 'neo4j'}, undefined, logger);
	}

	async connect() {
		return super.connect(-1);
	}
}