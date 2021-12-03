const logger = require('khala-logger/log4js').consoleLogger('test:SQL');
const assert = require('assert');
const MySQL = require('../Mysql');
const {ORM} = MySQL;
const {setup} = require('./_connection');
describe('smoke test', () => {

	const DB_NAME = 'database';
	let mysql;
	beforeEach(() => {
		mysql = require('./_connection').mysql;

	});
	afterEach(async () => {
		await mysql.close();
	});
	it('connect', async () => {
		await mysql.connect('database', true);
		const pong = await mysql.ping();
		assert.ok(pong);
	});
	it('connect with silence', async () => {

		await mysql.connect(DB_NAME, true);
		const models = await setup(mysql);
		const user = models.User;
		const ormWrapper = new ORM(user);
		const rows = await ormWrapper.list(user);
		logger.info(rows);
	});
});
