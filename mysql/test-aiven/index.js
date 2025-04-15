import MySQL from '../index.js';

describe('aiven cloud', function () {
	this.timeout(0);
	const password = process.env.MYSQL_PASSWORD;
	const domain = process.env.MYSQL_HOST
	const username = 'avnadmin';
	const port = 22013;
	const name = 'defaultdb';
	it('connect by string', async () => {
		const connectionString = `mysql://${username}:${password}@${domain}:${port}/${name}?ssl-mode=REQUIRED`;

		const mysql = new MySQL({}, connectionString);
		await mysql.connect();
		await mysql.disconnect();

	});
	it('connect by options', async () => {
		const mysql = new MySQL({domain, username, password, name, port});
		const ca = process.env.MYSQL_CA;

		mysql.ssl = {
			ca,
		};

		await mysql.connect();
		await mysql.disconnect();

	});
});