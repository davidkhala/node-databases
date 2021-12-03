import MongoConnect from '../index.js';
import assert from 'assert';
describe('sample data', function () {
	this.timeout(0);
	const user = 'admin';
	const {password} = process.env;
	const domain = 'free.5afsx.mongodb.net';
	const connect = new MongoConnect(domain, user, password);
	it('sample_airbnb', async () => {
		const dbName = 'sample_airbnb';
		await connect.connect(dbName);
		const namesOnly = await connect.listCollections(true);
		assert.ok(Array.isArray(namesOnly));
		console.log(namesOnly);

	});
	it('create collection', async () => {
		await connect.connect('dev');
		await connect.createCollection('foo');
		const databases = await connect.listDatabases(true);
		assert.ok(databases.includes('dev'));
	});
	it('list database', async () => {
		await connect.connect('dev');
		const databases = await connect.listDatabases(true);
		console.debug(databases);

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
