import {MongoClient} from 'mongodb';
import assert from 'assert';
import DB from '@davidkhala/db/index.js';

export default class MongoDB extends DB {
	/**
     *
     * @param domain
     * @param [username]
     * @param [password]
     * @param [dbName] if not specified, specify in #connect
     * @param {string} [connectionString]
     */
	constructor({domain, username, password, name = '', port, dialect, driver}, connectionString) {
		super({domain, username, password, name, port, dialect, driver}, connectionString);
		if (connectionString) {
			this.connectionString = connectionString;
		}
		this.connection = new MongoClient(this.connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
	}

	async connect(name) {
		if (!name) {
			name = this.name;
		}
		const {connection} = this;
		await connection.connect();
		this.db = connection.db(name);
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
		await this.connection.close();
		delete this.db;
	}

}

