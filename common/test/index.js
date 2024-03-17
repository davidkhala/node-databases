import DB from '../index.js';
import assert from 'assert';

describe('connection string', () => {
	const assertConnectionString = (opts, connectionStr) => assert.strictEqual(new DB(opts).connectionString, connectionStr);
	const domain = 'localhost';
	it('default dialect', () => {
		assertConnectionString({domain}, 'db://localhost');

		class NewDB extends DB {

		}

		assert.strictEqual(new NewDB({domain}).connectionString, 'newdb://localhost');
	});
	it('mocking mysql', () => {
		const port = 3306;
		const dialect = 'mysql';
		assertConnectionString({domain, port, dialect}, 'mysql://localhost:3306');
		assertConnectionString({domain, dialect}, 'mysql://localhost');
		assert.doesNotThrow(() => {
			new DB({port, dialect});
		});
		assertConnectionString({domain, port, dialect, username: 'mysql'}, 'mysql://mysql@localhost:3306');
		assertConnectionString({
			domain,
			port,
			dialect,
			username: 'mysql',
			password: 'password'
		}, 'mysql://mysql:password@localhost:3306');
		assertConnectionString({domain, port, dialect, driver: 'maria'}, 'mysql+maria://localhost:3306');

	});
});
describe('retry connect', () => {

	it('throwDB', async () => {
		class ThrowDB extends DB {
			async _connect() {
				throw Error('fake error');
			}
		}

		const db = new ThrowDB({});
		await assert.rejects(db.connect(0));
		await assert.rejects(db.connect());
	});
	it('delay DB', async () => {
		class DelayDB extends DB {
			constructor() {
				super({});
				this.connectTime = 0;
			}

			async _connect() {
				if (this.connectTime < 100) {
					this.connectTime++;
					throw Error('fake error');
				}
			}
		}

		const db = new DelayDB();
		await assert.rejects(db.connect(10));
	});
});