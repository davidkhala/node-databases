import {ContainerManager} from '@davidkhala/dockerode/docker.js';
import PostGRE from '../index.js';
import {docker} from './recipe.js';
import {sleep} from '@davidkhala/light';

describe('docker postgre', function () {
	this.timeout(0);
	const manager = new ContainerManager();
	const password = 'mysecretpassword';
	let stop;
	before(async () => {
		stop = await docker(manager, {HostPort: 6432, password});
		await sleep(2000); // FIXME very ugly postgresql warmup time that cannot be skipped by nodejs client
	});
	it('connect', async () => {
		const postgre = new PostGRE({domain: 'localhost', port: 6432, password});
		await postgre.connect();

		await postgre.disconnect();
	});
	after(async () => {
		await stop();
	});

});