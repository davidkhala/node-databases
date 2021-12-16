import Client from '../index.js';
import assert from "assert";

describe('free', function () {
	this.timeout(0)
	const endpoint = 'redis-18528.c295.ap-southeast-1-1.ec2.cloud.redislabs.com:18528';

	const domain = undefined
	const port = undefined

	it('connect', async () => {
		const client = new Client({domain, port, endpoint}, undefined, undefined);
		await client.connect();
		await client.disconnect();
	});
	it('put and verify', async () => {
		const {redis_password: password} = process.env
		const client = new Client({domain, port, endpoint}, 'admin', password);
		await client.connect();
		const key = 'key'
		const value = 'value'
		await client.set(key, value);
		const result = await client.get(key)
		assert.strictEqual(result, value)
		await client.disconnect();
	})
	it('put and nuke', async () => {
		const {redis_password: password} = process.env
		const client = new Client({domain, port, endpoint}, 'admin', password);
		await client.connect();
		const key = 'key'
		const value = 'value'
		await client.set(key, value);
		assert.strictEqual(await client.get(key), value)
		await client.clear();
		const shouldbeEmpty = await client.get(key)
		assert.ok(!shouldbeEmpty)

		await client.disconnect();
	})


});
