import Client from "../index.js";

describe('render', function () {
    this.timeout(0);
    const dialect = 'rediss';
    const username = process.env.REDIS_USER
    const password = process.env.REDIS_PASSWORD
    const domain = process.env.REDIS_ENDPOINT


    it('connect', async () => {
        const client = new Client({domain, username, password, dialect});
        await client.connect();
        await client.disconnect();
    });
});