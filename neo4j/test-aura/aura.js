import {AuraDB} from '../aura.js';
import {Neo4jAdmin} from '../index.js';
import {querySet} from '../test/recipe.js';

describe('AuraDB', function () {
	this.timeout(0);
	const password = process.env.NEO4J_PASSWORD;
	const instance = process.env.INSTANCE
	const neo4j = new AuraDB({instance, password});
	const dba = new Neo4jAdmin(neo4j);
	before(async () => {
		await neo4j.connect();
		await dba.clear();
	});
	it('connect', () => {
	});
	it('query', async () => {
		await querySet(neo4j);
	});

	after(async () => {
		await neo4j.disconnect();
	});
});
