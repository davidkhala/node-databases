import PostGRE from '../dml.js';
import assert from 'assert';
describe('aws aurora serverless v2', function () {
	this.timeout(0);
	it('connect: write endpoint', async () => {
		// write only endpoint
		const rwEndpoint = 'aurora-postgres-dev.cluster-cokklhjnetng.ap-east-1.rds.amazonaws.com';

		const username = 'postgres';
		const {password} = process.env;
		const pg = new PostGRE({domain: rwEndpoint}, username, password);
		await pg.connect();
		await pg.disconnect();

	});
	it('connect: read endpoint', async () => {
		// read only endpoint
		const roEndpoint = 'aurora-postgres-dev.cluster-ro-cokklhjnetng.ap-east-1.rds.amazonaws.com';
		const username = 'postgres';
		const {password} = process.env;

		const pgro = new PostGRE({domain: roEndpoint}, username, password);
		await pgro.connect();
		const res = await pgro.databases(true);
		assert.ok(res.includes('rdsadmin')); // aws extra database/user


		await pgro.disconnect();
	});
});
