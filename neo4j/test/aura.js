import {AuraDB} from '../aura.js';
import {Node} from '../cypher/node.js';
import assert from 'assert';
import {SingleRelationship} from '../cypher/relationship.js';
import {Neo4jAdmin} from '../index.js';

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
		const nodeTypes = ['Person'];
		const from = new Node('d', nodeTypes, {name: 'David'});
		const to = new Node('t', nodeTypes, {name: 'Chloe'});
		const rel = new SingleRelationship('m', 'love');
		await neo4j.query(...from.create());
		await neo4j.query(...to.create());
		await neo4j.query(...rel.create(from, to));
		const result = await neo4j.query(...Node.list());

		assert.strictEqual(result.length, 2);
		assert.ok(result.find(({properties}) => properties.name === 'David'));
	});
	it('connect', () => {
	});
	after(async () => {
		await neo4j.disconnect();
	});
});
