const logger = require('khala-logger/log4js').consoleLogger('test:SQL');
const {ORM} = require('../Mysql');
describe('SQL admin test', async () => {
	const {mysql, setup} = require('./_connection');
	const DB_NAME = 'database';
	beforeEach(async () => {
		await mysql.connect(DB_NAME, true);
		await setup(mysql);
	});
	afterEach(async () => {
		await mysql.close();
	});
	const showAllTables = async () => {
		const result = await mysql.showAllSchemas();
		logger.info(result);
	};
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
		await mysql.dropSchema('User');
		await showAllTables();
	});
	it('dropAllTableTest', async () => {
		await mysql.dropAllTables();
		await showAllTables();
	});
	it('dropDatabase', async () => {
		await mysql.dropDatabase('database');
	});

});

