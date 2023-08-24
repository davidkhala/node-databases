import {Atlas} from '../atlas.js';
import assert from 'assert';

describe('atlas', function () {
    this.timeout(0);
    const username = 'admin';
    const password = 'XvGItdb83ABWyBc4'// process.env.ATLAS_PASSWORD;
    const domain = 'free.csxewkh.mongodb.net';
    const connect = new Atlas({domain, username, password});
    it('connect', async () => {
        await connect.connect('');
    })

    it('create collection', async () => {
        await connect.connect('dev');
        await connect.createCollection('foo');
        const databases = await connect.listDatabases(true);
        assert.ok(databases.includes('dev'));
    });
    it('list database', async () => {
        await connect.connect('dev');
        const databases = await connect.listDatabases(true);
        assert.deepStrictEqual(databases, ['dev', 'admin', 'local'])

    });
    it('dropDatabase', async () => {
        await connect.connect('dev');
        await connect.dropDatabase();
        const databases = await connect.listDatabases(true);
        assert.ok(!databases.includes('dev'));
    });
    after(async () => {
        await connect.disconnect();
    });
});
