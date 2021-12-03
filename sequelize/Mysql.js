const Sequelize = require('sequelize');
const {DataTypes, Op} = Sequelize;
DataTypes.TIMESTAMP = 'TIMESTAMP'; // no any match for mysql dataType:TIMESTAMP
class MySQL {

	/**
	 * @param {SequelizeConnectOpts} connectOpts
	 * @param logger
	 */
	constructor(connectOpts, logger = console) {
		const {username = 'root', password = '', host = 'localhost', port = 3306} = connectOpts;
		Object.assign(this, {username, password, host, port});
		this.logger = logger;
	}

	_createConnection(database, logging = false) {
		const {username, password, host, port} = this;
		return new Sequelize(database, username, password,
			{
				logging,
				host,
				port,
				dialect: 'mysql',
				pool: {
					max: 200,
					min: 0,
					idle: 10000
				},
				timestamps: false,
				define: {
					charset: 'utf8',
					freezeTableName: true // prevent sequelize from pluralizing table names
				}
			}
		);
	}

	async close() {
		await this.connection.close();
		delete this.connection;
	}

	/**
	 * create table
	 * @param {boolean} [refresh] if truthy, drop existing database before creation
	 * @returns {Promise<void>}
	 */
	async sync(refresh) {
		await this.connection.sync({force: !!refresh});
	}

	async dropTable(tableName) {
		this.logger.warn(`dropTable[${tableName}]`);
		await this.connection.queryInterface.dropTable(tableName);
	}

	async dropAllTables() {
		this.logger.warn('dropAllTables');
		await this.connection.queryInterface.dropAllTables();
	}

	async dropDatabase(database) {
		this.logger.warn(`dropDatabase[${database}]`);
		await this.connection.queryInterface.dropDatabase(database);
	}

	async dropSchema(schema) {
		this.logger.warn(`dropSchema[${schema}]`);
		if (this.connection.options.dialect === 'mysql') {
			this.logger.warn(`sequelize:dropSchema in dialect[mysql] => dropTable[${schema}]`);
		}
		await this.connection.queryInterface.dropSchema(schema);
	}

	async showAllSchemas() {
		const result = await this.connection.queryInterface.showAllSchemas();
		if (this.connection.options.dialect === 'mysql') {
			this.logger.debug('sequelize::showAllSchemas in dialect[mysql] => show all `Tables_in_database` ');
			return result.map(e => e.Tables_in_database);
		}
		return result;
	}

	async dropAllSchemas() {
		this.logger.warn('dropAllSchemas');
		await this.connection.queryInterface.dropAllSchemas();
	}

	async addColumn(table, column, type) {
		await this.connection.queryInterface.addColumn(table, column, type);
	}

	async ping() {
		try {
			await this.connection.authenticate();
			return true;
		} catch (e) {
			this.logger.error(e);
			return false;
		}
	}

	/**
	 *
	 * @param {string} database
	 * @param {boolean} [silence]
	 */
	async connect(database, silence) {
		const logger = silence ? false : this.logger.debug.bind(this.logger);
		if (!this.connection) {
			this.connection = this._createConnection(database, logger);
		}
		try {
			await this.connection.query('show databases;');
		} catch (e) {
			const {name, original} = e;
			if (name === 'SequelizeConnectionError' && original.sqlMessage && original.sqlMessage.includes('Unknown database')) {
				this.logger.warn(original.sqlMessage, 'creating');
				const emptyConnection = this._createConnection('', logger);
				await emptyConnection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
				await emptyConnection.close();
				this.logger.warn(original.sqlMessage, 'created');
			} else {
				throw e;
			}
		}

	}

	// TODO move it out as it limited to mysql
	async setIDBias(tableName, bias) {
		await this.connection.query(`ALTER TABLE \`${tableName}\` AUTO_INCREMENT = ${bias};`);
	}

	setModel(tagName, model, opts) {
		return this.connection.define(tagName, model, opts);
	}

	getModel(tagName) {
		return this.connection.modelManager.getModel(tagName);
	}

	listModels() {
		return this.connection.modelManager.all;
	}
}


const dataTypes = {
	string: Sequelize.DataTypes.STRING,
	object: Sequelize.DataTypes.JSON,
	number: Sequelize.DataTypes.FLOAT,
	boolean: Sequelize.DataTypes.BOOLEAN
};

const modelOf = (obj) => {
	const result = {};
	for (const key in obj) {
		result.key = dataTypes[typeof key];
	}
	return result;
};

class ORM {
	constructor(model) {
		Object.assign(this, {model});
	}

	async list(filter = {}) {
		return this.model.findAll({
			where: filter
		});
	}

	async deleteAll() {
		await this.model.destroy({
			where: {}
		});
	}

	async clearData() {
		await this.model.truncate({cascade: true});
	}

	async findByPrimary(primary) {
		return this.model.findByPk(primary);
	}

	async update(obj, diff) {
		await this.model.update(diff);
	}

	async insert(data) {
		await this.model.create(data);
	}

	async count() {
		return await this.model.count();
	}

	async lastID() {
		return await this.model.max('id');
	}
}

Object.assign(MySQL, {ORM, DataTypes, Op, modelOf});

module.exports = MySQL;

