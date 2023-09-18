import {LocalhostNeo4j} from '../localhost.js';
import {ContainerManager} from '@davidkhala/dockerode/docker.js';
import {docker, initPasswordCmd} from './recipe.js';
import {execSync} from '@davidkhala/light/devOps.js';
import {Neo4jAdmin} from '../index.js';

describe('docker: preset password', function () {
	this.timeout(0);

	let stop;

	const password = 'davidkhala';
	const neo4j = new LocalhostNeo4j({password});
	const dba = neo4j.dba;
	before(async () => {
		const manager = new ContainerManager();
		stop = await docker(manager, {password});
		await neo4j.connect();
	});

	it('change password', async () => {
		await dba.passwd(password, 'password');
		await dba.clear();
	});
	after(async () => {
		await neo4j.disconnect();
		await stop();
	});
});

describe('docker: default password', function () {
	this.timeout(0);

	let stop;

	const password = 'password';

	before(async () => {
		const manager = new ContainerManager();
		stop = await docker(manager);
		const neo4j = new LocalhostNeo4j();
		await neo4j.connect();
		await neo4j.disconnect();
	});
	it('change password', async () => {

		execSync(initPasswordCmd(password));
		const newNeo4j = new LocalhostNeo4j({password});
		await newNeo4j.connect();
		const dba = new Neo4jAdmin(newNeo4j);
		await dba.clear();
		await newNeo4j.disconnect();
	});
	after(async () => {

		await stop();
	});
});