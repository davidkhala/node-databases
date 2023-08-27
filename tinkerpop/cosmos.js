import Gremlin from 'gremlin';
import assert from 'assert';
import {AbstractGremlin} from './index.js';
import {Edge, Vertex} from './query.js';

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

	}

	async getV(id) {

		const result = await this.queryOne(CosmosVertex.get(id));

		if (result) {
			assert.equal(result.id, id, `cosmos assigned id[${result.id}] should equals specified id[${id}]`);
		}
		return result;
	}

}


export class CosmosVertex extends Vertex {
	/**
	 *
	 * @param type The Label of vertex
	 * @param id
	 * @param [partitionKey]
	 */
	constructor(type, id, partitionKey = 'partitionKey') {
		super(type);
		this.id = id;
		this.partitionKey = partitionKey;
	}

	create(properties, partitionValue = this.id) {
		return super.create(Object.assign({
			[this.partitionKey]: partitionValue,
			id: this.id
		}, properties));
	}

	get() {
		return CosmosVertex.get(this.id);
	}

}

export class CosmosEdge extends Edge {
	/**
	 *
	 * @param type
	 * @param [id]
	 */
	constructor(type, id) {
		super(type);
		this.childTraversalSource = 'g.';
		this.id = id;
	}

	create(from, to, properties = {}) {
		return super.create(from, to, Object.assign({id: this.id}, properties));
	}
}