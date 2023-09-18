import DB, {DBA} from '@davidkhala/db';
import assert from 'assert';
import {auth, driver as Neo4jDriver, Session} from 'neo4j-driver';
import {Truncate} from './cypher/admin.js';

/**
 * @enum
 */
export const DefaultDatabase = {
	neo4j: 'neo4j',
	system: 'system'
};

export class Neo4j extends DB {
	constructor({domain, port = 7687, username = 'neo4j', name = username, password, driver, dialect}, connectionString, logger) {

		super({domain, port, name, username, password, driver, dialect}, connectionString, logger);
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

	/**
	 * TODO WIP
	 * @param template
	 * @param values
	 * @returns {Promise<void>}
	 */
	async rawQuery(template, values) {
		return await this.connection.executeQuery(template, values);
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

	/**
	 * @returns {Neo4jAdmin}
	 */
	get dba() {
		return new Neo4jAdmin(this);
	}

}

export class Neo4jAdmin extends DBA {

	/**
	 * @param {Neo4j} neo4j
	 */
	constructor(neo4j) {
		super(neo4j);
	}

	async clear() {
		await this.db.query(Truncate);
	}

	async passwd(currentPassword, newPassword) {
		const clonedOpts = Object.assign({}, this.db, {name: DefaultDatabase.system});

		const cloned = new Neo4j(clonedOpts, undefined, this.db.logger);
		await cloned.connect();

		await cloned.query(`:use system;ALTER CURRENT USER SET PASSWORD FROM '${currentPassword}' TO '${newPassword}'`);
		await cloned.disconnect();
	}
}