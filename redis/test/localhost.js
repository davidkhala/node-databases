import Client, {RedisTx} from '../index.js';
import assert from 'assert';
import {ContainerManager} from '@davidkhala/docker/docker.js';
import {dragonFly, stackServer} from './recipe.js';

/**
 *
 * @param {Client} client
 */
const tests = (client) => {
	it('get/set', async () => {
		const value = 'b';
		const key = 'a';
		await client.set(key, value);
		assert.equal(await client.get(key), value);
	});
	it('hashTable get set', async () => {
		const table = 'hash';
		const value = 'b';
		const key = 'a';
		await client.hSet(table, key, value);
		assert.equal(await client.hGet(table, key), value);
		const all = await client.hGetAll(table);
		assert.deepEqual(all, {[key]: value});
	});
	const redisTx = new RedisTx(client);
	it('transaction:abort', async () => {
		const tx = redisTx.begin();
		const value = 'b';
		const key = 'tx';
		tx.set(key, value);
		await redisTx.close();
		assert.equal(await client.get(key), null);
	});
	it('transaction:commit', async () => {
		const tx = redisTx.begin();
		const value = 'b';
		const key = 'tx';
		tx.set(key, value);
		await redisTx.commit();
		assert.equal(await client.get(key), value);
	});
};
describe('stackServer', function () {
	this.timeout(0);
	const client = new Client({domain: 'localhost'});
	const dockerInstance = new ContainerManager(undefined, console);

	let stop;
	before(async () => {
		stop = await stackServer(dockerInstance);
		await client.connect();
	});
	tests(client);

	after(async () => {
		await client.disconnect();
		await stop();
	});
});
describe('dragonFly', function () {
	this.timeout(0);
	const client = new Client({domain: 'localhost'});
	const dockerInstance = new ContainerManager(undefined, console);

	let stop;
	before(async () => {
		stop = await dragonFly(dockerInstance);
		await client.connect();
	});

	tests(client);

	after(async () => {
		await client.disconnect();
		await stop();
	});
});
