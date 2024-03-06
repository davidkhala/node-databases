import Supa from '../../supabase/index.js';

describe('', function () {
	this.timeout(0);
	it('', async () => {
		const user = 'postgres';
		const projectName = 'qplmusgcroaumzwhypmy';
		const region = 'aws-0-ap-southeast-1';
		const password = process.env.SUPABASE_PASSWORD;
		const db = new Supa({user, region, password, projectName});
		await db.connect();
		await db.disconnect();
	});
});