import {TeradataConnection} from 'teradatasql';
import DB from '@davidkhala/db/index.js';
import assert from 'assert';

export default class Teradata extends DB {

	/**
	 *
	 * @param domain
	 * @param port
	 * @param username
	 * @param password
	 * @param [client]
	 * @param [cursor]
	 */
	constructor({domain, port = 1025, username = 'dbc', password}, client, cursor) {
		super({domain, port, username, password});
		this.connection = client || new TeradataConnection();
		this.cursor = cursor;
	}

	_connect() {
		const {username: user, domain: host, password} = this;
		this.connection.connect({host, user, password});
		this.cursor = this.connection.cursor();
		return true;
	}

	execute(sql, values) {
		// TODO try https://github.com/Teradata/nodejs-driver/blob/develop/samples/BatchInsert.ts#L16
		this.cursor.execute(sql, values);
	}

	query(sql, values, {withHeader} = {}) {
		this.execute(sql, values);
		const rows = this.cursor.fetchall();
		if (withHeader) {
			rows.unshift(this.cursor.description.map(desc => desc[0]));
		}
		return rows;
	}


	disconnect() {
		this.cursor.close();
		this.connection.close();
	}

	get dba() {
		return new TDDBA(this, this.connection, this.cursor);
	}

	use(database) {
		this.execute(`SET SESSION DATABASE ${database};`);
	}
}

export class TDDBA extends Teradata {


	drop(database) {
		if (this.exist(database)) {
			this.truncate(database);
			this.execute(`DROP DATABASE ${database}`);
		}
	}

	truncate(database) {
		this.execute(`DELETE DATABASE ${database}`); // delete all the objects in the database:
	}

	exist(database) {
		const result = this.query(`SELECT * FROM DBC.DATABASESV WHERE DatabaseName='${database}'`);
		assert.ok(result.length < 2, 'No duplicated Database with same name ');
		return result.length === 1;
	}

	/**
	 * @param table_name can be in form of ${dbName}.${tableName}
	 */
	truncateTable(table_name) {
		this.execute(`DELETE ${table_name} ALL`);
	}

	dropTable(tableName) {
		this.execute(`DROP TABLE ${tableName};`);
	}

	session() {
		this.execute('help session');
		const row = this.cursor.fetchone();

		const result = {};
		row.forEach((field, index) => {
			result[this.cursor.description[index][0]] = field;
		});
		return result;
	}

	version() {
		this.execute('{fn teradata_nativesql}{fn teradata_database_version}');
		const rows = this.cursor.fetchone();
		return rows[0];
	}
}

