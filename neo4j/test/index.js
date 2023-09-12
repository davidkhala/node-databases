import {AuraDB} from '../aura.js';
import {docker} from './recipe.js';
import {ContainerManager} from '@davidkhala/dockerode/docker.js';
import {LocalhostNeo4j} from '../localhost.js';
import {Node} from '../cypher/node.js';
import assert from 'assert';
import {Truncate} from '../cypher/admin.js';
import {Relationship} from '../cypher/relationship.js';

describe('AuraDB', function () {
	this.timeout(0);
	const password = process.env.NEO4J_PASSWORD;
	const neo4j = new AuraDB({instance: '9e9db278', password});
	before(async () => {
		await neo4j.connect();
		await neo4j.query(Truncate);
	});
	it('query', async () => {
		const nodeTypes = ['Person'];
		const from = new Node('d', nodeTypes, {name: 'David'});
		const to = new Node('t', nodeTypes, {name: 'Chloe'});
		const rel = new Relationship('m', ['love']);
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
describe('localhost', function () {
	this.timeout(0);

	const handles = [];
	before(async () => {
		const manager = new ContainerManager();
		const handle = await docker(manager);
		handles.push(handle);

	});
	it('connect', async () => {
		const neo4j = new LocalhostNeo4j();
		const retryCount = await neo4j.connect();
		assert.ok(retryCount > 2000, `retryCount=${retryCount}`);
		await neo4j.disconnect();
	});
	after(async () => {
		await Promise.all(handles.map(_ => _()));
	});
});