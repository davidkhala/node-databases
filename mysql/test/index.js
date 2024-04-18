import {ContainerManager} from '@davidkhala/docker/docker.js';
import {socketPath} from '@davidkhala/docker/constants.js';
import {docker} from '../test-utils/recipe.js';
import MySQL from '../connect.js'

describe('test-utils', function () {
	this.timeout(0);
	const password = 'password';
	const manager = new ContainerManager({socketPath: socketPath(true)});

	const username = 'admin'
	const name = 'database'
	const mysql = new MySQL({domain:'localhost', username, password})
	let stop
	before(async ()=>{
	// start and stop take 12 seconds
		stop = await docker(manager, {HostPort: 3306,username, password, name});
	})
	it('', async () => {
		// TODO need to grant permission on root or new user
		await mysql.connect()
	});

	after(async ()=>{
		await stop();
	})
});

