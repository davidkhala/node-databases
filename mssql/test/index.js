import MSSQL, {root} from '../index.js';
import {docker} from '../test-utils/recipe.js';
import {ContainerManager} from '@davidkhala/docker/docker.js';
import {sleep} from '@davidkhala/light/index.js';

describe('localhost: docker', function () {
	this.timeout(0);
	const password = 'yourStrong(!)Password';
	const db = new MSSQL({domain: 'localhost', name: 'master', username: root, password});
	let stop;
	before(async () => {
		const manager = new ContainerManager({});
		stop = await docker(manager, {password});
		await sleep(5000);// FIXME
	});
	after(async () => {
		await stop();
	});
	it('connect', async () => {
		await db.connect();
		await db.disconnect();
	});
});