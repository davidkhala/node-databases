import DB from '@davidkhala/db/index.js';
import Sequelize from 'sequelize';

const levels = [
	'OFF',  // nothing is logged
	'FATAL', // fatal errors are logged
	'ERROR', // errors are logged
	'WARN',	// warnings are logged
	'INFO',	// infos are logged
	'DEBUG', // debug infos are logged
	'TRACE', // traces are logged
	'ALL'	// everything is logged
];

export class AbstractSequelize extends DB {

	/**
	 *
	 * @param {number} [loggingLevel] [level reference]{@link levels}
	 */
	constructor({domain, port, name, username, password, dialect, driver}, logger, loggingLevel = 4) {
		super({domain, port, name, username, password, dialect, driver}, undefined, logger);
		this.loggingLevel = loggingLevel;
		this.reset();
	}

	async disconnect() {
		await this.connection.close();
		this.reset();
	}

	reset() {
		delete this.connection;
		const {name, username, password, domain: host, port, logger, dialect} = this;
		let logging = !!logger;
		switch (typeof logger) {
			case 'function':
				logging = logger;
				break;
			case 'object':
				logging = (...msg) => this.loggingLevel > 4 ? logger.debug(...msg) : logger.info(msg[0]);
		}

		this.connection = new Sequelize(name, username, password, {
			logging, host, port, dialect, timestamps: false, pool: {
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
