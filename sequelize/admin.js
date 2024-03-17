import {DBA} from '@davidkhala/db';

export class DBAdmin extends DBA {
	/**
	 *
	 * @param {Sequelize} connection
	 * @param logger
	 */
	constructor({connection, logger}) {
		super({connection, logger});
		this.interface = connection.getQueryInterface();
	}

	async dropTable(tableName) {
		await this.interface.dropTable(tableName);
	}

	async dropAllTables() {
		await this.interface.dropAllTables();
	}

	async dropDatabase(database) {
		await this.interface.dropDatabase(database);
	}

	async createDatabase(database, ifNotExist) {
		if (ifNotExist && await this.getDatabase(database)) {
			return;
		}
		await this.interface.createDatabase(database);
	}

	async clear() {
		const DBs = await this.showDatabases();
		for (const db of DBs) {
			await this.dropDatabase(db);
		}
	}

	/**
	 * @abstract
	 * @returns {Promise<string[]>}
	 */
	async showDatabases() {
		return [];
	}

	async getDatabase(database) {
		const dbs = await this.showDatabases();
		return dbs.find(db => db === database);
	}

	async dropSchema(schema) {
		await this.interface.dropSchema(schema);
	}

	async showAllSchemas() {
		return await this.interface.showAllSchemas();
	}

	async dropAllSchemas() {
		await this.interface.dropAllSchemas();
	}

	async addColumn(table, column, type) {
		await this.interface.addColumn(table, column, type);
	}

}