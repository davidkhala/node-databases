import MySQL from '../index.js';
import {parse} from '@davidkhala/db/vendor/connection-string.js';

describe('free', function () {
	this.timeout(0);
	it('connect by string', async () => {
		const connectionString = 'to be fill';
		const {
			domain, port, username, password, options, name
		} = parse(connectionString);

		const mysql = new MySQL({domain, username, password, name, port});


		await mysql.connect();


		await mysql.disconnect();

	});
});