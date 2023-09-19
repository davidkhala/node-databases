import {AuraDB} from '../aura.js';
import {Neo4jAdmin} from '../index.js';
import {querySet} from './recipe.js';

describe('AuraDB', function () {
	this.timeout(0);
	const password = process.env.NEO4J_PASSWORD;
	const neo4j = new AuraDB({instance: '9e9db278', password});
	const dba = new Neo4jAdmin(neo4j);
	before(async () => {
		await neo4j.connect();
		await dba.clear();
	});
	it('query', async () => {
		await querySet(neo4j);
	});
	it('connect', () => {
	});
	after(async () => {
		await neo4j.disconnect();
	});
});
