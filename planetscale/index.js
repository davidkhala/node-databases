import {connect} from '@planetscale/database';
import DB from '@davidkhala/db';

export default class Planetscale extends DB {
	constructor({host, username, password, name} = {}, connectionString, logger) {
		super({domain: host, username, password, dialect: 'mysql', name}, connectionString, logger);
		const connectOpts = {
			username, password, host, url: connectionString
		};
		this.connection = connect(connectOpts);
	}

	get connectionString() {
		return super.connectionString + '?sslaccept=strict';
	}

	async connect() {
		await this.connection.refresh();
	}


	async query(template, values = [], requestOptions = {}) {
		return await this.connection.execute(template, values, requestOptions);
	}
}
