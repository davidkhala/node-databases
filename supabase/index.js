import {createClient} from '@supabase/supabase-js';
import {Connectable} from '@davidkhala/db/index.js';

export default class Supabase extends Connectable {
	constructor(projectName, ANON_KEY) {
		super();
		this.connection = createClient(`https://${projectName}.supabase.co`, ANON_KEY, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
				detectSessionInUrl: false
			}
		});
	}

	async userCreate(email, password) {
		const {data, error} = await this.connection.auth.signUp({
			email, password
		});
		if (error) {
			throw error;
		}
		const {user} = data;
		return user;
	}

}
