import Client from '../index.js';
import assert from 'assert';

describe('redisCloud', function () {
	this.timeout(0);

	let domain, port

	before(async ()=> {
		const endpoint = process.env.REDIS_ENDPOINT;
		[domain, port] = endpoint.split(':');
	})

	it('connect', async () => {
		const client = new Client({domain, port});
		await client.connect();
		await client.disconnect();
	});
	const username = 'default';
	const password = process.env.REDIS_PASSWORD;
	it('put and verify', async () => {

		const client = new Client({domain, port, username, password});
		await client.connect();
		const key = 'key';
		const value = 'value';
		await client.set(key, value);
		const result = await client.get(key);
		assert.strictEqual(result, value);
		await client.disconnect();
	});
	it('put and nuke', async () => {

		const client = new Client({domain, port, username, password});
		await client.connect();
		const key = 'key';
		const value = 'value';
		await client.set(key, value);
		assert.strictEqual(await client.get(key), value);
		await client.clear();
		const shouldbeEmpty = await client.get(key);
		assert.ok(!shouldbeEmpty);

		await client.disconnect();
	});


});
describe('render', function () {
	this.timeout(0);
	const dialect = 'rediss';
	let domain, port
	before(async ()=> {
		const endpoint = 'red-cnfv8g5a73kc73dcurc0:QpXiOKD4OavTTzTNefrDtbM1v6ZisYiF@singapore-redis.render.com:6379';
		[domain, port] = endpoint.split(':');
	})

	it('connect', async () => {
		const client = new Client({domain, port, dialect});
		await client.connect();
		await client.disconnect();
	});
});
