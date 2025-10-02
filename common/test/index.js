import DB from '../index.js';
import {parse} from '../vendor/connection-string.js'
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
	it('parse', () => {
		let connectionString = 'mysql://avnadmin:password@mysql-davidkhala.d.aivencloud.com:22013/defaultdb?ssl-mode=REQUIRED';
		let parsed= parse(connectionString);
		console.debug(parsed)
		let {domain, port, dialect, username, password, name} = parsed;
		assert.equal(domain, 'mysql-davidkhala.d.aivencloud.com');
		assert.equal(port, 22013);
		assert.equal(dialect, 'mysql');
		assert.equal(username, 'avnadmin');
		assert.equal(password, 'password');
		assert.equal(name, 'defaultdb');
		// 2
		connectionString = 'mysql+mysqlconnector://avnadmin:password@mysql-davidkhala.d.aivencloud.com:22013/defaultdb?ssl-mode=REQUIRED';
		const {driver}= parse(connectionString);
		assert.equal(driver, 'mysqlconnector')
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