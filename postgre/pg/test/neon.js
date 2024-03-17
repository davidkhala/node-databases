import NeonDB from '../neon.js';


describe('pooled connection', function () {
	this.timeout(0);

	const domain = 'ep-jolly-voice-a17npw2v-pooler.ap-southeast-1.aws.neon.tech';
	const password = process.env.NEON_PASSWORD;
	const db = new NeonDB({domain, password}, undefined, undefined);
	before(async () => {
		await db.connect();
	});
	it('reconnect', async () => {
		db.disconnect();
		await db.connect();
	});
	after(async () => {
		db.disconnect();
	});
});