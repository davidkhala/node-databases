import DB from '@davidkhala/db';
import {Client, fql} from 'fauna';


export class FaunaDB extends DB {

	constructor({password}) {
		super({username: '-', password});
		this.connection = new Client({
			secret: password
		});
	}


	async disconnect() {
		this.connection.close();
	}

	async query(queryString, requestOptions = {}) {
		const q = fql([queryString]);
		const {data} = await this.connection.query(q, requestOptions);
		return data;
	}
}