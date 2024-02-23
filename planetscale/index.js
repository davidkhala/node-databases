import {connect} from '@planetscale/database';
import DB from '@davidkhala/db';

export default class Planetscale extends DB {
	constructor({host, username, password}, logger) {
		super({domain: host, username, password}, undefined, logger);
		this.connection = connect({username, password, host});
	}

	async connect() {
		await this.connection.refresh();
	}
}
