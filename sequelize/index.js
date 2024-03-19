import DB from '@davidkhala/db/index.js';
import Sequelize from 'sequelize';
import assert from 'assert';

export const {DataTypes} = Sequelize;

export const dataTypeMap = {
	string: DataTypes.STRING,
	object: DataTypes.JSON,
	number: DataTypes.FLOAT,
	boolean: DataTypes.BOOLEAN
};
export const modelOf = (obj) => dataTypeMap[typeof obj];

export class AbstractSequelize extends DB {

	constructor({domain, port, name, username, password, dialect, driver}, logger) {
		super({domain, port, name, username, password, dialect, driver}, undefined, logger);
		this.reset();
	}

	async disconnect() {
		await this.connection.close();
		this.reset();
	}

	get logging() {

		switch (typeof this.logger) {
			case 'boolean':
				return this.logger;
			case 'undefined':
				return false;
			default:
				return (msg, sequelize) => {
					assert.ok(sequelize);
					this.logger.log(msg);
				};
		}
	}

	reset() {
		delete this.connection;
		const {name, username, password, domain: host, port, dialect} = this;

		this.connection = new Sequelize(name, username, password, {
			logging: this.logging, host, port, dialect, timestamps: false, pool: {
				max: 200, min: 0, idle: 10000
			}, define: {
				charset: 'utf8', freezeTableName: true // prevent sequelize from pluralizing table names
			}
		});
	}

	/**
	 * create table
	 * @param {boolean} [refresh] if truthy, drop existing database before creation
	 * @returns {Promise<void>}
	 */
	async sync(refresh) {
		await this.connection.sync({force: !!refresh});
	}

	async _connect() {
		await this.connection.authenticate();
		return true;
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
