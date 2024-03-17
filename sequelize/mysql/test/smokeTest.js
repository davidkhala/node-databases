import {ORM} from '@davidkhala/sequelize/orm.js';
import {setup, mysql, containerStart} from './_connection.js';
import {consoleLogger} from '@davidkhala/logger/log4.js';
import MySQL from '../mysql.js';
import {DefaultDatabase} from '@davidkhala/mysql-format/const.js';

const logger = consoleLogger('mysql:smoke test');

describe('connect test', function () {
	this.timeout(0);
	let stop;

	before(async () => {
		stop = await containerStart();
	});
	after(async () => {
		await stop();
	});

	it('connect', async () => {

		await mysql.connect(-1);
		await mysql.disconnect();
		await mysql.connect();
		await mysql.disconnect();
	});
	it('connect with noise', async () => {
		const mysql_quiet = new MySQL({password: 'password', name: DefaultDatabase.mysql}, true);
		await mysql_quiet.connect(-1);
		const models = await setup(mysql_quiet);

		const user = models.User;
		const ormWrapper = new ORM(user);
		const rows = await ormWrapper.list();
		logger.info(rows);
		await mysql_quiet.disconnect();
	});
});
