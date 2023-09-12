export class DBAdmin {
	/**
	 *
	 * @param {Sequelize} connection
	 */
	constructor({connection}) {
		this.interface = connection.getQueryInterface();
		this.connection = connection;
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

	/**
	 *
	 * @returns {Promise<string[]>}
	 */
	async showDatabases() {
		return [];
		// to implement
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