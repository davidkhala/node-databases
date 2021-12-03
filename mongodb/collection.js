import {Collection} from 'mongodb';
import assert from 'assert';

export default class CollectionSimple extends Collection {
	constructor(asCollection) {
		const {collectionName} = asCollection;
		const {db, options} = asCollection.s;
		super(db, collectionName, options);
		this.collection = asCollection;
	}

	async insertOne(doc) {
		const {acknowledged, insertedId} = await super.insertOne(doc);
		assert.ok(acknowledged);
		return insertedId;
	}
	async list() {
		return super.find().toArray();
	}

	static as(collection) {
		return new CollectionSimple(collection);
	}
}
