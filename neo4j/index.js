import DB from '@davidkhala/db';
import assert from 'assert';
import {auth, driver as Neo4jDriver, Session} from 'neo4j-driver';

export const DefaultDatabase = ['neo4j', 'system'];

export class Neo4j extends DB {
	constructor({domain, port = 7687, username = 'neo4j', name = username, password, driver, dialect}, connectionString) {

		super({domain, port, name, username, password, driver, dialect}, connectionString);
		this.connection = Neo4jDriver(this.connectionString, auth.basic(this.username, password));
	}

	/**
	 * similar to {@link connect} or {@link info}
	 * @returns {Promise<void>}
	 */
	async auth() {
		assert.ok(await this.connection.verifyAuthentication(), 'verifyAuthentication failed');
	}

	async connect(maxRetry) {
		const result = super.connect(maxRetry);
		/**
		 *
		 * @type {Session}
		 */
		this.session = this.connection.session();
		return result;
	}

	async query(template, values = {}, postProcess) {
		const {records} = await this.session.run(template, values);

		const result = records.map(({_fields}) => _fields);
		if (typeof postProcess === 'function') {
			return result.map(postProcess);
		}
		return result;

	}

	async _connect() {
		await this.connection.verifyConnectivity();
	}

	async info() {
		const {address, agent, protocolVersion} = await this.connection.getServerInfo();
		return {address, agent, protocolVersion};
	}

	async disconnect() {
		await this.connection.close();
		delete this.session;
	}

}