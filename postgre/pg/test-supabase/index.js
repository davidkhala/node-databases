import Supabase from '../supabase.js';

const user = 'postgres';
const projectName = process.env.PROJECT;
const region = 'aws-0-ap-southeast-1';
const password = process.env.DB_PASSWORD;
describe('supabase: Transaction mode', function () {
	this.timeout(0);
	const db = new Supabase({user, region, password, projectName}, true);
	before(async () => {
		await db.connect();
	});
	it('', async () => {


	});
	after(async () => {
		await db.disconnect();
	});
});
describe('supabase: Session mode', function () {
	this.timeout(0);
	const db = new Supabase({user, region, password, projectName});
	before(async () => {
		await db.connect();
	});
	it('', async () => {


	});
	after(async () => {
		await db.disconnect();
	});
});