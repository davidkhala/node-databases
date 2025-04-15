import {createClient} from '@supabase/supabase-js';
import {Connectable} from '@davidkhala/db/index.js';

export default class Supabase extends Connectable {
    /**
     *
     * @param projectName
     * @param key either ANON_key or service_role key.
     */
    constructor(projectName, key) {
        super();
        this.connection = createClient(`https://${projectName}.supabase.co`, key, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
                detectSessionInUrl: false
            }
        });
    }

    async userCreate(email, password) {
        const {data, error} = await this.connection.auth.admin.createUser({
            email, password,
            email_confirm: true
        });
        if (error) {
            throw error;
        }
        const {user} = data;
        return user;
    }

    async userDelete(user_id) {
        const {error} = await this.connection.auth.admin.deleteUser(user_id);
        if (error) {
            throw error;
        }
    }

    async userGet(email) {
        const users = await this.listUsers()
        return users.find(user => user.email === email);
    }

    async listUsers() {
        const {data, error} = await this.connection.auth.admin.listUsers();
        if (error) {
            throw error;
        }
        return data.users;
    }
}

