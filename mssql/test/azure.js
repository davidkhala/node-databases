import MSSQL from '../index.js';

describe('Azure SQL', function () {
	this.timeout(0);
	it('always-free', async () => {
		const domain = 'sql-server-hk.database.windows.net';
		const port = 1433;
		const username = 'CloudSA7b5eda98';
		const password = process.env.AZURE_SQL_PASSWORD;
		const name = 'mssql';

		const mssql = new MSSQL({domain, username, port, password, name});
		await mssql.connect();
		mssql.disconnect();
	});
});