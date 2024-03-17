import {ContainerManager} from '@davidkhala/docker/docker.js';
import {docker} from '../test-utils/recipe.js';

describe('test-utils', function () {
	this.timeout(0);
	const password = 'password';
	const manager = new ContainerManager();
	it('', async () => {
		// start and stop take 12 seconds
		const stop = await docker(manager, {HostPort: 3306, password});
		await stop();
	});
});

