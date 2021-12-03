import MongoConnect from '../index.js';
import assert from 'assert';
import Autonomous from '../autonomous.js';
import {docs} from './dataDump.js';

const accommodates$gt = async (collection, number = 2) => {
	const query = {accommodates: {$gt: number}};

	const projection = {
		_id: false,
		name: true,
		summary: true,
		minimum_nights: true,
		maximum_nights: true,
		accommodates: true,
	};
	return await collection.find(query).project(projection).toArray();
};

describe('aggregation', () => {

	const user = 'admin';
	const {password} = process.env;
	const domain = 'free.5afsx.mongodb.net';
	const connect = new MongoConnect(domain, user, password);

	describe('sample_airbnb', function () {
		this.timeout(0);
		const dbName = 'sample_airbnb';

		const collectionName = 'listingsAndReviews';
		let collection;
		before(async () => {
			await connect.connect(dbName);
			collection = await connect.getCollection(collectionName);
		});
		it('listCollections', async () => {
			const namesOnly = await connect.listCollections(true);
			assert.ok(Array.isArray(namesOnly));
			assert.ok(namesOnly.includes(collectionName));
		});

		it('1. accommodates $gt', async () => {
			const result = await accommodates$gt(collection);
			console.debug(result);
		});

	});
	after(async () => {
		await connect.disconnect();
	});
});


describe('autonomous', function () {
	this.timeout(0);
	const {password} = process.env;
	const domain = 'UKYLLMQVBNKWZDY-FREEJSON.adb.ap-seoul-1.oraclecloudapps.com';

	const connect = new Autonomous({domain, password});

	const collectionName = 'dev';
	before(async () => {
		await connect.connect();
	});

	it('prepare Collections', async () => {

		const collection = await connect.createCollection(collectionName, true);

		await collection.insertMany(docs);
	});
	it('1. accommodates $gt', async () => {
		const collection = await connect.getCollection(collectionName);
		const result = await accommodates$gt(collection, 4 );
		console.debug(result);
	});


	after(async () => {
		await connect.disconnect();
	});
});


