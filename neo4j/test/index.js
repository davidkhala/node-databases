import {AuraDB} from '../aura.js';
import {docker} from './recipe.js';
import {ContainerManager} from '@davidkhala/dockerode/docker.js';
import {LocalhostNeo4j} from '../localhost.js';

describe('AuraDB', function () {
	this.timeout(0);
	const password = process.env.NEO4J_PASSWORD;
	it('connect', async () => {
		const neo4j = new AuraDB({instance: '9e9db278', password});
		await neo4j.connect();
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
		await neo4j.connect();
		await neo4j.disconnect();
	});
	after(async () => {
		await Promise.all(handles.map(_ => _()));
	});
});