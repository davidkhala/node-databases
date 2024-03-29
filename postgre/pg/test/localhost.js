import {ContainerManager} from '@davidkhala/docker/docker.js';
import PG from '../index.js';
import {docker} from '@davidkhala/postgres-format/test-utils/recipe.js';

describe('docker postgres', function () {
	this.timeout(0);
	const manager = new ContainerManager();
	const password = 'mysecretpassword';
	let stop = async () => undefined;
	before(async () => {
		stop = await docker(manager, {HostPort: 6432, password});
	});
	it('connect', async () => {
		const postgre = new PG({domain: 'localhost', port: 6432, password});
		await postgre.connect();

		await postgre.disconnect();
	});
	after(async () => {
		await stop();
	});

});