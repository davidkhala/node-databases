import Planetscale from '../index.js';

describe('', function () {
	this.timeout(0);
	const host = 'aws.connect.psdb.cloud';
	const username = 'eppp2un7gw6zstf7emux';
	const password = process.env.PLANETSCALE_PASSWORD;
	const name = 'node-database';
	const ps = new Planetscale({host, username, password, name});
	before(async () => {
		await ps.connect();
	});

	it('exec', async () => {
		const results = await ps.query(`select 1 from dual where 1=?`, [1]);
		console.debug(results);
	});
});