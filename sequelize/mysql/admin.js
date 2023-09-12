import {DBAdmin} from '../admin.js';

export class MySQLAdmin extends DBAdmin {
	constructor(mysql, logger) {
		super(mysql);
		this.logger = logger;
	}

	async dropTable(tableName) {
		this.logger.warn(`dropTable[${tableName}]`);
		await super.dropTable(tableName);
	}

	async dropAllTables() {
		this.logger.warn('dropAllTables');
		await super.dropAllTables();
	}

	async dropDatabase(database) {
		this.logger.warn(`dropDatabase[${database}]`);
		await super.dropDatabase(database);
	}

	async dropSchema(schema) {
		this.logger.warn(`dropSchema[${schema}]`);
		this.logger.warn(`sequelize:dropSchema in dialect[mysql] => dropTable[${schema}]`);
		await super.dropSchema(schema);
	}

	async showAllSchemas() {
		const result = await super.showAllSchemas();
		this.logger.debug('sequelize::showAllSchemas in dialect[mysql] => show all `Tables_in_mysql` ');
		return result.map(e => e.Tables_in_mysql);

	}

	async dropAllSchemas() {
		this.logger.warn('dropAllSchemas');
		await super.dropAllSchemas();
	}

	async setIDBias(tableName, bias) {
		await this.connection.query(`ALTER TABLE \`${tableName}\` AUTO_INCREMENT = ${bias};`);
	}

	async showDatabases() {
		const result = await this.connection.query('show databases');
		return result[0].map(({Database}) => Database);
	}
}