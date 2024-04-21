import MySQL from '../index.js';

describe('free', function () {
	this.timeout(0);
	it('connect by string', async () => {
		const connectionString = 'to be fill';

		const mysql = new MySQL({}, connectionString);
		try {
			await mysql.connect();
		}catch (e){

		}

		await mysql.disconnect();

	});
});