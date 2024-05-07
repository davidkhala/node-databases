import {docker} from './recipe.js';
import {ContainerManager} from '@davidkhala/docker/docker.js';
import MongoDB from '../mongo.js';
import assert from 'assert';

const domain = 'localhost';
describe('docker: password less', function () {
	this.timeout(0);
	const HostPort = 27016;

	let stopCallback;
	before(async () => {
		const manager = new ContainerManager();
		stopCallback = await docker(manager, {HostPort});
	});
	after(async () => {
		await stopCallback();
	});

	it('connect', async () => {
		const mongoConnect = new MongoDB({domain, port: HostPort});
		await mongoConnect.connect();
		const dbs = await mongoConnect.listDatabases();
		const expectedDBs = [
			{name: 'admin', sizeOnDisk: 8192, empty: false},
			{empty: false, name: 'config', sizeOnDisk: 12288},
			{name: 'local', sizeOnDisk: 8192, empty: false}];
		assert.deepStrictEqual(dbs, expectedDBs);
		await mongoConnect.disconnect();

	});
});