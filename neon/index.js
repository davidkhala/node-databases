import {neon, Pool} from '@neondatabase/serverless';
import DB from '@davidkhala/db';

export default class NeonServerless extends DB {
	constructor(DATABASE_URL, logger) {
		super(undefined, DATABASE_URL, logger);
		this.connection = neon(DATABASE_URL);

	}

	async query(template, values = [], requestOptions = {}) {
		// https://neon.tech/docs/serverless/serverless-driver

		const result = await this.connection(template, values, requestOptions);
		if (requestOptions.fullResults) {
			const {rows, fields, rowCount} = result;
			return rows;
		} else {
			return result;
		}


	}
}