import Client from '../index.js';

describe('free', () => {

	const endpoint = 'redis-18528.c295.ap-southeast-1-1.ec2.cloud.redislabs.com:18528';
	const client = new Client({domain: undefined, port: undefined, endpoint}, undefined, undefined);
	it('connect', async () => {

		await client.connect();
	});
	after(async () => {
		await client.disconnect()
	})

});
