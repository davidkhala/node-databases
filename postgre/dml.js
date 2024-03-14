import PG from './index.js';
import assert from 'assert';

export const DefaultDatabase = {
	template0: 'template0',
	template1: 'template1',
	postgres: 'postgres'
};
export default class DML extends PG {
	async databases(nameOnly) {
		const result = await this.query('SELECT * FROM pg_database');
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
