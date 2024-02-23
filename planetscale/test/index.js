import Planetscale from '../index.js';

describe('', function () {
	this.timeout(0);
	it('connect', async () => {
		const host = 'aws.connect.psdb.cloud';
		const username = 'eppp2un7gw6zstf7emux';
		const password = process.env.PLANETSCALE_PASSWORD;
		const ps = new Planetscale({host, username, password});
		await ps.connect();
	});
});