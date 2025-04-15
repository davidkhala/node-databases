import Supabase from '../index.js';
import * as assert from 'assert';

describe('restful supabase', function () {
    this.timeout(0);
    const projectName = process.env.PROJECT;
    const service_role = process.env.SERVICE_ROLE;

    const supabase = new Supabase(projectName, service_role);

    const email = 'davidkhala@gmail.com'

    it('create user', async () => {
        await supabase.userCreate(email, 'password');
    });
    it('list users', async () => {
        const users = await supabase.listUsers();
        assert.ok(Array.isArray(users));
    });
    it('drop user', async () => {
        const user = await supabase.userGet(email);
        if (user) {
            await supabase.userDelete(user.id)
        }

    })
});