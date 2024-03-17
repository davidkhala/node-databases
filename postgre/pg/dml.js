import PG from './index.js';
import assert from 'assert';
import {DefaultDatabase} from '@davidkhala/postgres-format/const.js';
import {databases} from '@davidkhala/postgres-format/queries.js'

export default class DML extends PG {
	async databases(nameOnly) {
		const result = await this.query(databases);
		const dbs = result.rows.map(({datname}) => datname);
		for (const defaultDB of Object.values(DefaultDatabase)) {
			assert.ok(dbs.includes(defaultDB));
		}
		if (nameOnly) {
			return dbs;
		}

		return result;
	}
}
