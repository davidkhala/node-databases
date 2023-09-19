import Gremlin from 'gremlin';
import assert from 'assert';
import {AbstractGremlin, AbstractGremlinAdmin} from './index.js';
import {drop, IdEdge, IdVertex, Vertex} from './query.js';
import {sleep} from '@davidkhala/light/index.js';

export const idRegExp = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

export class Cosmos extends AbstractGremlin {
	/**
	 *
	 * @param database
	 * @param graph
	 * @param username Azure Cosmos DB Account(帐户)
	 * @param password PRIMARY KEY | SECONDARY KEY
	 * @param [logger]
	 */
	constructor({database, graph, username, password}, logger = console.debug) {
		assert.ok(password, 'Missing PRIMARY KEY / SECONDARY KEY');
		const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(
			`/dbs/${database}/colls/${graph}`,
			password,
		);


		super({domain: `${username}.gremlin.cosmos.azure.com`, port: 443, dialect: 'wss'}, {
			authenticator,
			traversalsource: 'g',
			rejectUnauthorized: true,
			mimeType: 'application/vnd.gremlin-v2.0+json'
		}, logger);
		this.defer = 1;
		this.delay = 1;
	}

	async query(traversal, values, requestOptions) {
		await sleep(this.defer, null);
		const result = await super.query(traversal, values, requestOptions);
		await sleep(this.delay, null);
		return result;
	}

}

export class CosmosAdmin extends AbstractGremlinAdmin {

	/**
	 * @param {Cosmos} db
	 */
	constructor(db) {
		super(db);
	}

	async clear({evaluationTimeout = 10000} = {}) {
		await this.query(drop, undefined, {evaluationTimeout});
	}
}


export class CosmosVertex extends IdVertex {
	/**
	 *
	 * @param type The Label of vertex
	 * @param [id]
	 * @param [partitionKey]
	 */
	constructor(type, id, partitionKey = 'partitionKey') {
		super(type, id);
		this.partitionKey = partitionKey;
	}

	create(properties, partitionValue = this.id) {
		return super.create(Object.assign({
			[this.partitionKey]: partitionValue,
		}, properties));
	}

	where() {
		// super.super alternative
		return Vertex.prototype.where.call(this, this.id);
	}

}

export class CosmosEdge extends IdEdge {
	/**
	 *
	 * @param type
	 * @param [id]
	 */
	constructor(type, id) {
		super(type, id);
		this.childTraversalSource = 'g.';
	}

}