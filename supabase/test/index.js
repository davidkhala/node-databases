import Supabase from '../index.js';

describe('serverless supabase', function () {
	this.timeout(0);
	const projectName = 'qplmusgcroaumzwhypmy';
	const ANON_KEY = process.env.ANON_KEY;
	const supabase = new Supabase(projectName, ANON_KEY);
	it('create user', async () => {
		await supabase.userCreate('david_khala@gmail.com', 'password');
	});
});