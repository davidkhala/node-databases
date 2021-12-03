const {MongoClient} = require('mongodb');
const assert = require('assert');

class MongoConnect {
	/**
	 *
	 * @param domain
	 * @param username
	 * @param password
	 * @param [dbName] if not specified, specify in {@link connect}
	 */
	constructor(domain, username, password, dbName = '') {
		const uri = `mongodb+srv://${username}:${password}@${domain}/${dbName}?retryWrites=true&w=majority`;
		this.dbName = dbName;
		this.client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
	}

	async connect(dbName) {
		if (this.dbName) {
			dbName = this.dbName;
		}
		const {client} = this;
		await client.connect();
		this.db = client.db(dbName);
	}

	async listDatabases(nameOnly) {

		const {ok, databases, operationTime} = await this.db.admin().listDatabases({nameOnly});
		assert.strictEqual(ok, 1);
		if (nameOnly) {
			return databases.map(({name}) => name);
		}
		return databases;
	}

	async getCollection(name, boolResponse) {
		const cursor = await this.db.listCollections({name});
		const some = await cursor.next();
		if (some) {
			return boolResponse ? !!some : this.db.collection(name);
		}
		// else return undefined
	}

	async dropCollection(name) {
		try {
			return await this.db.dropCollection(name);
		} catch (e) {
			const {code, codeName, message} = e;
			if (code === 26 && codeName === 'MONGO-26' && message === 'ns not found') {
				return false;
			}
			throw e;
		}
	}

	async createCollection(name, ensureExist = true) {
		if (ensureExist) {
			const exist = await this.getCollection(name);
			if (exist) {
				return exist;
			}
		}
		return await this.db.createCollection(name);
	}

	/**
	 *
	 * @param {boolean} [nameOnly]
	 * @return {Promise<(Pick<CollectionInfo, "name" | "type"> | CollectionInfo)[]|string[]>}
	 */
	async listCollections(nameOnly) {
		const collections = await this.db.listCollections(undefined, {nameOnly}).toArray();

		if (nameOnly) {
			return collections.map(({name}) => name);
		}
		return collections;
	}

	async dropDatabase() {
		return await this.db.dropDatabase();
	}

	async disconnect() {
		await this.client.close();
		delete this.db;
	}

}

module.exports = MongoConnect;

