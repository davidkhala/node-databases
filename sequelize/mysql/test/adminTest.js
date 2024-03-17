import {ORM} from '@davidkhala/sequelize/orm.js';
import {consoleLogger} from '@davidkhala/logger/log4.js';
import {containerStart, mysql, setup} from './_connection.js';
import {MySQLAdmin} from '../admin.js';
import MySQL from '../mysql.js';

const logger = consoleLogger('mysql: admin test');

describe('SQL admin test', function () {
	this.timeout(0);
	const dba = new MySQLAdmin(mysql, logger);
	let stop;
	before(async () => {
		stop = await containerStart();
		await mysql.connect(-1);
		await setup(mysql);
	});
	after(async () => {
		await mysql.disconnect();
		await stop();
	});
	const showAllTables = async () => {
		const result = await dba.showAllSchemas();
		logger.info(result);
	};

	const database = 'database';
	it('create database', async () => {
		await dba.createDatabase(database, true);
	});
	it('showAllTables', async () => {
		await showAllTables();
	});

	it('insert one', async () => {
		const model = mysql.getModel('User');
		const orm = new ORM(model);
		await orm.insert({id: 1, email: 'david-khala@hotmail.com'});
	});
	it('clear table data', async () => {
		const model = mysql.getModel('User');
		const orm = new ORM(model);
		await orm.clearData();

	});
	it('dropTable', async () => {
		await dba.dropSchema('User');
		await showAllTables();
	});
	it('dropAllTable', async () => {
		const mysql_1 = new MySQL({password: mysql.password, name: 'database'});
		const dba_1 = new MySQLAdmin(mysql_1, logger);
		await dba_1.dropAllTables();
		await showAllTables();
	});
	it('dropDatabase', async () => {
		await dba.dropDatabase(database);
	});

});

