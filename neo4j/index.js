import DB, {DBA} from '@davidkhala/db';
import assert from 'assert';
import {auth, driver as Neo4jDriver, Session, Transaction, Neo4jError} from 'neo4j-driver';
import {Transaction as AbstractTransaction} from '@davidkhala/db/index.js';
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
		this.reset();
	}

	reset() {
		this.connection = Neo4jDriver(this.connectionString, auth.basic(this.username, this.password));
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

	async queryOne(template, values = {}) {
		const {records} = await this.session.run(template, values);

		const fields = records.map(({_fields}) => _fields);

		return fields.map((result) => {
			assert.strictEqual(result.length, 1);
			return result[0];
		});
	}

	async _connect() {
		await this.connection.verifyConnectivity();
	}

	async info() {
		const {address, agent, protocolVersion} = await this.connection.getServerInfo();
		return {address, agent, protocolVersion};
	}

	async disconnect() {
		await this.session.close();
		delete this.session;
		await this.connection.close();
		delete this.connection;
		this.reset();

	}

	/**
	 * @returns {Neo4jAdmin}
	 */
	get dba() {
		return new Neo4jAdmin(this);
	}

	async _throwConnectError(e) {
		if (!(e instanceof Neo4jError)) {
			return true;
		}
		const {code, retriable, message} = e;
		return !(retriable === true && code === 'ServiceUnavailable' && message.startsWith('Could not perform discovery. No routing servers available.'));

	}
}

export class Neo4jTx extends AbstractTransaction {
	/**
	 * While a transaction is open the session cannot be used to run queries outside the transaction.
	 * @return {Transaction}
	 */
	async begin() {

		/**
		 *
		 * @type {Transaction}
		 */
		this.tx = await this.session.beginTransaction();
		return this.tx;
	}

	async run(template, values = {}) {
		return await this.tx.run(template, values);
	}

	async commit() {
		await this.tx.commit();
	}

	async close() {
		await this.tx.close();
	}

	async rollback() {
		await this.tx.rollback();
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
		const cloned = new Neo4j(clonedOpts, undefined, this.logger);
		await cloned.connect();

		await cloned.query(`ALTER CURRENT USER SET PASSWORD FROM '${currentPassword}' TO '${newPassword}'`);
		await cloned.disconnect();
	}
}