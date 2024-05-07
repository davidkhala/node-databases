import Autonomous from '../autonomous.js';

describe('oracle autonomous db', function () {
	this.timeout(0);
	it('always free', async () => {
		const password = process.env.ADB_PASSWORD;
		const domain = 'UKYLLMQVBNKWZDY-MONGO.adb.ap-seoul-1.oraclecloudapps.com';
		const db = new Autonomous({password, domain});
		await db.connect();
		await db.disconnect();
	});
});