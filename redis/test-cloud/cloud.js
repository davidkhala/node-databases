import Client from '../index.js';
import assert from 'assert';

describe('redisCloud', function () {
    this.timeout(0);
    const endpoint = process.env.REDIS_ENDPOINT || '';
    const [domain, port] = endpoint.split(':');

    const username = 'default';
    const password = process.env.REDIS_PASSWORD || '';

    it('connect', async () => {
        const client = new Client({domain, port});
        await client.connect();
        await client.disconnect();
    });

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

