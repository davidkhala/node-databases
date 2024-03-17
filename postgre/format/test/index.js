import {docker} from '../test-utils/recipe.js';
import {ContainerManager} from '@davidkhala/docker/docker.js';

describe('docker postgres', function () {
	this.timeout(0);
	const manager = new ContainerManager();
	const password = 'mysecretpassword';
	it('start and stop', async () => {
		const stop = await docker(manager, {HostPort: 5432, password});
		await stop();
	});
});