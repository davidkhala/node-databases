import Autonomous from '../autonomous.js';
import assert from 'assert';
import CollectionSimple from '../collection.js';
const {as} = CollectionSimple;
describe('autonomous', function () {
	this.timeout(0);
	const {password} = process.env;
	const domain = 'UKYLLMQVBNKWZDY-FREEJSON.adb.ap-seoul-1.oraclecloudapps.com';

	const connect = new Autonomous({domain, password});

	before(async () => {
		await connect.connect();
	});

	it('listCollections', async () => {

		const namesOnly = await connect.listCollections(true);
		assert.ok(Array.isArray(namesOnly));
		console.debug(namesOnly);
	});

	it('create Collections', async () => {
		const collectionName = 'foo';
		const collectionHandler = await connect.createCollection(collectionName);

		const wrapper = as(collectionHandler);
		const result = await wrapper.insertOne({hello: 'world'});
		console.debug(result);
		const list = await wrapper.list();
		console.debug(list);
		// 619c3c38fede73d959c75a18
	});

	it('getCollection', async () => {
		const collectionName = 'abc';
		const collection = await connect.getCollection(collectionName);
		assert.strictEqual(collection, undefined);

	});
	it('drop Collections', async () => {
		const collectionName = 'foo';
		const result = await connect.dropCollection(collectionName);
		console.debug(result);

	});
	it('drop database', async () => {
		const result = await connect.dropDatabase();
		console.debug(result);
	});
	after(async () => {
		await connect.disconnect();
	});
});

