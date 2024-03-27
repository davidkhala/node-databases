import Supabase from '../index.js';
import * as assert from 'assert';

describe('restful supabase', function () {
	this.timeout(0);
	const projectName = 'qplmusgcroaumzwhypmy';
	const service_role = process.env.SUPABASE_SERVICE_ROLE;

	const supabase = new Supabase(projectName, service_role);

	it('create user', async () => {
		await supabase.userCreate('davidkhala@gmail.com', 'password');
	});
	it('list users', async () => {
		const users = await supabase.listUsers();
		assert.ok(Array.isArray(users));
	});
});