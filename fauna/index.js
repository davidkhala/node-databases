import DB from '@davidkhala/db';
import {Client, fql} from 'fauna';

export class Fauna extends DB {

	constructor({password}) {
		super({username: '-', password});
		this.connection = new Client({
			secret: password
		});
	}


	async disconnect() {
		this.connection.close();
	}

	async query(template, values = [], requestOptions = {}) {
		const q = fql([template], ...values);
		const {data} = await this.connection.query(q, requestOptions);
		return data;
	}
}