import Supabase from '../supabase.js';

const user = 'postgres';
const projectName = 'qplmusgcroaumzwhypmy';
const region = 'aws-0-ap-southeast-1';
const password = process.env.SUPABASE_PASSWORD;
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