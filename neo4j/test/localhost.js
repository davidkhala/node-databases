import {LocalhostNeo4j} from '../localhost.js';
import {ContainerManager} from '@davidkhala/dockerode/docker.js';
import {docker, initPasswordCmd, querySet, transactionWrap} from './recipe.js';
import {execSync} from '@davidkhala/light/devOps.js';
import {Neo4jAdmin} from '../index.js';

describe('docker: preset password', function () {
	this.timeout(0);

	let stop;

	const password = 'password';
	const newPassword = 'davidkhala';
	let neo4j = new LocalhostNeo4j({password});
	let dba = neo4j.dba;
	before(async () => {
		const manager = new ContainerManager();
		stop = await docker(manager, {password});
		await neo4j.connect();
	});

	it('change password', async () => {
		await dba.passwd(password, newPassword);
		neo4j = new LocalhostNeo4j({password: newPassword});
		dba = neo4j.dba;
		await neo4j.connect();
	});
	it('reconnect', async () => {
		await neo4j.disconnect();
		await neo4j.connect();
		await neo4j.disconnect();
		await neo4j.connect();
	});
	it('query', async () => {
		await querySet(neo4j);
	});
	it('transaction', async () => {

		const _dba = neo4j.dba;
		await _dba.clear();
		let i = 0;
		while (i < 5) {
			await transactionWrap(neo4j);
			i++;
		}


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