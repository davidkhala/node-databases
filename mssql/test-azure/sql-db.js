import MSSQL from '../index.js';

describe('Azure SQL', function () {
	this.timeout(0);
	it('always-free', async () => {
		const domain = process.env.SQL_DOMAIN;
		const port = 1433;
		const username = process.env.SQL_USER;
		const password = process.env.SQL_PASSWORD;
		const name = 'mssql';

		const mssql = new MSSQL({domain, username, port, password, name});
		await mssql.connect(60000);
		mssql.disconnect();
	});
});