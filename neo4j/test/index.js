import {AuraDB} from '../aura.js';
import {docker} from './recipe.js';
import {ContainerManager} from '@davidkhala/dockerode/docker.js';
import {LocalhostNeo4j} from '../localhost.js';
import {Node} from '../cypher/node.js';
import assert from 'assert';

describe('AuraDB', function () {
	this.timeout(0);
	const password = process.env.NEO4J_PASSWORD;
	const neo4j = new AuraDB({instance: '9e9db278', password});
	before(async () => {
		await neo4j.connect();
	});
	it('query', async () => {
		const node = new Node();
		const result = await neo4j.query(...node.list());
		console.debug(result);
	});
	it('connect');
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