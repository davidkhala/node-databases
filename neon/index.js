import {neon} from '@neondatabase/serverless';
import DB from '@davidkhala/db';

export default class NeonServerless extends DB {
	constructor(DATABASE_URL, logger) {
		super(undefined, DATABASE_URL, logger);
		this.connection = neon(DATABASE_URL);
	}

	async query(template, values = [], requestOptions = {}) {
		// https://neon.tech/docs/serverless/serverless-driver
		return await this.connection(template, values, requestOptions);
	}
}